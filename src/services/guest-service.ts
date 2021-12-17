import { AppLogger } from 'src/states/app';
import { attachTrackEvent } from 'src/common/media';
import { deferredPromise } from 'src/common/util';
import { createGuestSignalService } from 'src/services/signal-service';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const initializeGuest = async (
  playAudio: (stream: MediaStream) => Promise<void>,
  logger: AppLogger,
  guestName: string,
) => {
  const context = new AudioContext();
  const output = context.createMediaStreamDestination();
  const localStream = await navigator.mediaDevices.getUserMedia({
    video: false,
    audio: { echoCancellation: true },
  });
  await playAudio(output.stream);
  const [setChannel, getChannel] = deferredPromise<RTCDataChannel>();
  const createHostPeer = async () => {
    const peer = new RTCPeerConnection({ iceServers: [] });
    const cloneStream = localStream;
    peer.ondatachannel = (ev) => {
      logger.info('data channel established');
      setChannel(ev.channel);
    };
    for (const track of cloneStream.getTracks()) {
      peer.addTrack(track);
    }
    attachTrackEvent(peer, context, output, logger, playAudio);

    return peer;
  };
  const host = await createHostPeer();
  const createAnswer = async (offer: string) => {
    await host.setRemoteDescription({ type: 'offer', sdp: offer });
    const answer = await host.createAnswer();
    await host.setLocalDescription(answer);
    return new Promise<string>((resolve) => {
      host.onicecandidate = (ev) => {
        if (!ev.candidate && host.localDescription != null) {
          resolve(host.localDescription.sdp);
        }
      };
    });
  };
  const setOnConnect = (f: () => void) => {
    host.onconnectionstatechange = () => {
      if (host.connectionState === 'connected') {
        logger.info('connected to host');
        f();
      }
    };
  };
  const preparePeer = (peer: RTCPeerConnection) => {
    const cloneStream = localStream.clone();
    for (const track of cloneStream.getTracks()) {
      peer.addTrack(track);
    }
    attachTrackEvent(peer, context, output, logger, playAudio);
  };
  const signalService = createGuestSignalService(guestName, getChannel, preparePeer, logger);
  const close = () => host.close();
  return { host, createAnswer, setOnConnect, close, signalService };
};

export type GuestService = Awaited<ReturnType<typeof initializeGuest>>;
