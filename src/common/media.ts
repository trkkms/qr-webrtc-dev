import { AppLogger } from 'src/states/app';

export const attachTrackEvent = (
  peer: RTCPeerConnection,
  context: AudioContext,
  dest: MediaStreamAudioDestinationNode,
  logger: AppLogger,
  playAudio: (stream: MediaStream) => Promise<void>,
): void => {
  if ('ontrack' in peer) {
    logger.info('set ontrack event');
    peer.ontrack = (ev) => {
      logger.info('ontrack event detected');
      for (const stream of ev.streams) {
        const src = context.createMediaStreamSource(stream);
        src.connect(dest);
        playAudio(dest.stream).then(() => {
          logger.info('update stream');
        });
      }
    };
  } else {
    logger.info('set onaddstream event');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (peer as any).onaddstream = (ev: { stream: MediaStream }) => {
      logger.info('onaddstream event detected');
      const src = context.createMediaStreamSource(ev.stream);
      src.connect(dest);
      playAudio(dest.stream);
    };
  }
};
