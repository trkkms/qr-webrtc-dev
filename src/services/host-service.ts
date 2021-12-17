import { nanoid } from 'nanoid';
import { AppLogger } from 'src/states/app';
import { attachStreamToDummyAudio, attachTrackEvent } from 'src/common/media';
import { deferredPromise } from 'src/common/util';
import { createHostSignalService } from 'src/services/signal-service';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const initializeHost = async (
  playAudio: (stream: MediaStream) => Promise<void>,
  logger: AppLogger,
  onStateChange: () => void,
) => {
  type Peer = Awaited<ReturnType<typeof createPeer>>;
  const peers = new Map<string, Peer>();
  const context = new AudioContext();
  const output = context.createMediaStreamDestination();
  const localStream = await navigator.mediaDevices.getUserMedia({
    video: false,
    audio: { echoCancellation: true },
  });
  attachStreamToDummyAudio(localStream);
  await playAudio(output.stream);
  const oscillateLocal = () => {
    const oscillator = context.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = 440;
    oscillator.connect(output);
    oscillator.start();
  };
  const onMessage = createHostSignalService(peers, logger);
  const createPeer = async () => {
    const id = nanoid();
    const [setName, getName] = deferredPromise<string>();
    const peer = new RTCPeerConnection({ iceServers: [] });
    peer.onconnectionstatechange = () => {
      logger.info(`${id.slice(0, 5)} / connection state change: ${peer.connectionState}`);
      onStateChange();
    };
    const cloneStream = localStream.clone();
    attachStreamToDummyAudio(cloneStream);
    for (const track of cloneStream.getTracks()) {
      peer.addTrack(track, cloneStream);
    }
    attachTrackEvent(peer, context, output, logger, playAudio);

    const data = peer.createDataChannel('host-to-guest');
    const [setOpenChannel, getOpenChannel] = deferredPromise<RTCDataChannel>();
    data.onopen = () => {
      logger.info(`${id.slice(0, 5)} / data channel established`);
      setOpenChannel(data);
    };
    data.onmessage = (ev) => {
      onMessage(id, JSON.parse(ev.data));
    };
    await peer.setLocalDescription(await peer.createOffer());
    const sdp = await new Promise<string>((resolve) => {
      peer.onicecandidate = (ev) => {
        if (!ev.candidate && peer.localDescription) {
          resolve(peer.localDescription.sdp);
        }
      };
    });
    const connect = async (answerSdp: string) => {
      const promise = new Promise<void>((resolve) => {
        peer.onconnectionstatechange = () => {
          logger.info(`${id.slice(0, 5)} / connection state change: ${peer.connectionState}`);
          onStateChange();
          if (peer.connectionState === 'connected') {
            resolve();
          }
        };
      });
      await peer.setRemoteDescription({ type: 'answer', sdp: answerSdp });
      return promise;
    };
    const close = () => {
      peer.close();
      peers.delete(id);
      onStateChange();
    };
    const getConnectionState = () => peer.connectionState;
    const sendMessage = async (message: unknown) => {
      const openData = await getOpenChannel();
      openData.send(JSON.stringify(message));
    };
    const wrappedPeer = { id, sdp, connect, close, getConnectionState, sendMessage, data, setName, getName };

    peers.set(id, wrappedPeer);
    return wrappedPeer;
  };
  const getPeer = (id: string): Peer | undefined => {
    return peers.get(id);
  };
  const getPeers = (): Map<string, Peer> => peers;

  return {
    createPeer,
    getPeer,
    getPeers,
    oscillateLocal,
  };
};

export type HostService = Awaited<ReturnType<typeof initializeHost>>;
export type HostToGuestPeer = NonNullable<ReturnType<HostService['getPeer']>>;
