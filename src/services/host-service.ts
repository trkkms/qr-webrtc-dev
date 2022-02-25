import { nanoid } from 'nanoid';
import { AppLogger } from 'src/states/app';
import { attachStreamToDummyAudio, attachTrackEvent, streamWithGain } from 'src/common/media';
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
  const playNode = context.createMediaStreamDestination();
  const gainNode = context.createGain();
  output.connect(gainNode);
  gainNode.connect(playNode);
  const recordOutput = context.createMediaStreamDestination();
  const localStream = await navigator.mediaDevices.getUserMedia({
    video: false,
    audio: { latency: 0.01, echoCancellation: true },
  });
  const [setRecordStream, getRecordStream] = deferredPromise<MediaStreamAudioSourceNode>();
  attachStreamToDummyAudio(localStream);
  const localRecordStream = localStream.clone();
  attachStreamToDummyAudio(localRecordStream);
  const localRecordSrc = context.createMediaStreamSource(localRecordStream);
  localRecordSrc.connect(recordOutput);
  const [changeVolume, baseStream] = streamWithGain(context, localStream);
  const changeSpeakerVolume = async (volume: number) => {
    if (volume <= 1.0) {
      return;
    }
    gainNode.gain.value = volume;
  };
  await playAudio(playNode.stream);
  const onMessage = createHostSignalService(peers, logger);
  const createPeer = async () => {
    const id = nanoid();
    const [setName, getName] = deferredPromise<string>();
    const peer = new RTCPeerConnection({ iceServers: [] });
    const cloneStream = baseStream.clone();
    attachStreamToDummyAudio(cloneStream);
    for (const track of cloneStream.getTracks()) {
      peer.addTrack(track, cloneStream);
    }
    attachTrackEvent(peer, context, output, playNode, logger, playAudio);
    peer.onconnectionstatechange = () => {
      logger.info(`${id.slice(0, 5)} / connection state change: ${peer.connectionState}`);
      onStateChange();
    };
    const data = peer.createDataChannel('host-to-guest');
    const [setOpenChannel, getOpenChannel] = deferredPromise<RTCDataChannel>();
    data.onopen = () => {
      logger.info(`${id.slice(0, 5)} / data channel established`);
      setOpenChannel(data);
    };
    data.onmessage = (ev) => {
      onMessage(id, JSON.parse(ev.data));
    };
    await peer.setLocalDescription(await peer.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: false }));
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
  const startRecording = () => {
    const cloneStream = recordOutput.stream.clone();
    attachStreamToDummyAudio(cloneStream);
    const src = context.createMediaStreamSource(cloneStream);
    src.connect(recordOutput);
    const stream = recordOutput.stream;
    setRecordStream(src);
    const [ext, mime] = MediaRecorder.isTypeSupported('audio/mp4') ? ['mp4', 'audio/mp4'] : ['webm', 'audio/webm'];
    const recorder = new MediaRecorder(stream, { mimeType: mime, audioBitsPerSecond: 64000 });
    const chunks: Blob[] = [];
    recorder.ondataavailable = (evt) => {
      chunks.push(evt.data);
    };
    recorder.start(1000);
    const stopRecording = () => {
      recorder.pause();
    };
    const save = () => {
      const blob = new Blob(chunks, { type: mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.download = `recorded.${ext}`;
      a.href = url;
      a.target = '_blank';
      a.click();
    };
    const clear = async () => {
      if (recorder.state === 'paused' || recorder.state === 'recording') {
        recorder.stop();
        const src = await getRecordStream();
        src.disconnect(recordOutput);
      }
    };
    const pause = () => {
      recorder.pause();
    };
    const resume = () => {
      recorder.resume();
    };
    const getRecordState = () => recorder.state;
    return {
      stopRecording,
      save,
      clear,
      getRecordState,
      pause,
      resume,
    };
  };

  return {
    createPeer,
    getPeer,
    getPeers,
    changeVolume,
    startRecording,
    changeSpeakerVolume,
  };
};

export type HostService = Awaited<ReturnType<typeof initializeHost>>;
export type HostToGuestPeer = NonNullable<ReturnType<HostService['getPeer']>>;
