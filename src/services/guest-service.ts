import { AppLogger } from 'src/states/app';
import { attachStreamToDummyAudio, attachTrackEvent } from 'src/common/media';
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
    audio: { latency: 0.01, echoCancellation: true },
  });
  attachStreamToDummyAudio(localStream);
  await playAudio(output.stream);
  const [setChannel, getChannel] = deferredPromise<RTCDataChannel>();
  const [setHost, getHost] = deferredPromise<RTCPeerConnection>();
  const createHostPeer = async () => {
    const peer = new RTCPeerConnection({ iceServers: [] });
    const cloneStream = localStream.clone();
    attachStreamToDummyAudio(cloneStream);
    for (const track of cloneStream.getTracks()) {
      peer.addTrack(track, cloneStream);
    }
    attachTrackEvent(peer, context, output, logger, playAudio);
    peer.onconnectionstatechange = () => {
      logger.info(`host connection state change: ${peer.connectionState}`);
    };
    peer.ondatachannel = (ev) => {
      logger.info('data channel established');
      setChannel(ev.channel);
    };
    setHost(peer);
    return peer;
  };
  const createAnswer = async (offer: string) => {
    const host = await getHost();
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
  const setOnConnect = async (f: () => void) => {
    const host = await getHost();
    host.onconnectionstatechange = () => {
      if (host.connectionState === 'connected') {
        logger.info('connected to host');
        f();
      }
    };
  };
  const preparePeer = (peer: RTCPeerConnection) => {
    const cloneStream = localStream.clone();
    attachStreamToDummyAudio(cloneStream);
    for (const track of cloneStream.getTracks()) {
      peer.addTrack(track, cloneStream);
    }
    attachTrackEvent(peer, context, output, logger, playAudio);
  };
  const signalService = createGuestSignalService(guestName, getChannel, preparePeer, logger);
  const close = async () => (await getHost()).close();
  return { createAnswer, setOnConnect, close, signalService, createHostPeer };
};

export type GuestService = Awaited<ReturnType<typeof initializeGuest>>;
