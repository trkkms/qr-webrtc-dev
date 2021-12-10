export const attachTrackEvent = (
  peer: RTCPeerConnection,
  context: AudioContext,
  dest: MediaStreamAudioDestinationNode,
): void => {
  if ('ontrack' in peer) {
    peer.ontrack = (ev) => {
      for (const stream of ev.streams) {
        const src = context.createMediaStreamSource(stream);
        src.connect(dest);
      }
    };
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (peer as any).onaddstream = (ev: { stream: MediaStream }) => {
      const src = context.createMediaStreamSource(ev.stream);
      src.connect(dest);
    };
  }
};
