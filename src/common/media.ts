import { AppLogger } from 'src/states/app';

export const attachStreamToDummyAudio = (stream: MediaStream): void => {
  let a: HTMLAudioElement | null = new Audio();
  a.muted = true;
  a.srcObject = stream;
  a.addEventListener('canplaythrough', () => {
    a = null;
  });
};

export const attachTrackEvent = (
  peer: RTCPeerConnection,
  context: AudioContext,
  dest: AudioNode,
  playNode: MediaStreamAudioDestinationNode,
  logger: AppLogger,
  playAudio: (stream: MediaStream) => Promise<void>,
  recordDest?: MediaStreamAudioDestinationNode,
): void => {
  if ('ontrack' in peer) {
    logger.info('set ontrack event');
    peer.ontrack = (ev) => {
      logger.info('ontrack event detected');
      for (const stream of ev.streams) {
        logger.info('loop on stream');
        attachStreamToDummyAudio(stream);
        const src = context.createMediaStreamSource(stream);
        src.connect(dest);
        playAudio(playNode.stream).then(() => {
          logger.info('update stream');
        });
      }
    };
  } else {
    logger.info('set onaddstream event');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (peer as any).onaddstream = (ev: { stream: MediaStream }) => {
      logger.info('onaddstream event detected');
      attachStreamToDummyAudio(ev.stream);
      const src = context.createMediaStreamSource(ev.stream);
      src.connect(dest);
      playAudio(playNode.stream).then(() => {
        logger.info('update stream');
      });
    };
  }
};

export const streamWithGain = (context: AudioContext, stream: MediaStream): [(volume: number) => void, MediaStream] => {
  const gainNode = context.createGain();
  const dest = context.createMediaStreamDestination();
  const src = context.createMediaStreamSource(stream);
  src.connect(gainNode);
  gainNode.connect(dest);
  const changeVolume = (volume: number) => {
    gainNode.gain.setValueAtTime(volume, context.currentTime);
  };
  return [changeVolume, dest.stream];
};

export const getVideoStream = async (): Promise<MediaStream> =>
  await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      facingMode: 'environment',
      width: { ideal: 640 },
      height: { ideal: 480 },
    },
  });
