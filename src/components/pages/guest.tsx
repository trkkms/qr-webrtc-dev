/** @jsxImportSource @emotion/react */
import React, { useCallback, useRef, useState } from 'react';
import { css } from '@emotion/react';
import Guest00Init from 'src/components/stages/guest-00-init';
import AudioControl from 'src/components/common/audio-control';
import { useLogger } from 'src/states/app';
import { GuestService } from 'src/services/guest-service';
import GuestStages from 'src/components/stages/guest-stages';

const Guest = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const logger = useLogger();
  const [service, setService] = useState<GuestService | undefined>(undefined);
  const playAudio = useCallback(async (stream: MediaStream) => {
    if (audioRef.current == null) {
      logger.warn('ignore playAudio() since no audio element found.');
      return;
    }
    audioRef.current.srcObject = stream;
    await audioRef.current.play();
  }, []);
  return (
    <main
      css={css({
        width: '100%',
        height: '100%',
        maxWidth: 1200,
      })}
    >
      {service == null && <Guest00Init setService={setService} playAudio={playAudio} />}
      {service && <GuestStages service={service} />}
      <AudioControl audioRef={audioRef} />
    </main>
  );
};

export default Guest;
