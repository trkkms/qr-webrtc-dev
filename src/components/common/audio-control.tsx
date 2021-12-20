/** @jsxImportSource @emotion/react */
import React, { useEffect } from 'react';
import { useAtomValue } from 'jotai/utils';
import { volumeAtom } from 'src/states/app';

namespace AudioControl {
  export interface Props {
    audioRef: React.RefObject<HTMLAudioElement>;
  }
}

const AudioControl = ({ audioRef }: AudioControl.Props) => {
  const volumes = useAtomValue(volumeAtom);
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volumes.speaker.muted ? 0 : volumes.speaker.volume;
    }
  }, [volumes.speaker.volume, volumes.speaker.muted]);
  return (
    <div>
      <audio autoPlay ref={audioRef} />
    </div>
  );
};

export default AudioControl;
