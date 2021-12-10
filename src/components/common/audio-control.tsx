/** @jsxImportSource @emotion/react */
import React from 'react';

namespace AudioControl {
  export interface Props {
    audioRef: React.RefObject<HTMLAudioElement>;
  }
}

const AudioControl = ({ audioRef }: AudioControl.Props) => {
  return (
    <div>
      <audio autoPlay ref={audioRef} />
    </div>
  );
};

export default AudioControl;
