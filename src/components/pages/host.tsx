/** @jsxImportSource @emotion/react */
import React, { useCallback, useRef, useState } from 'react';
import { css } from '@emotion/react';
import Host00Init from 'src/components/stages/host-00-init';
import AudioControl from 'src/components/common/audio-control';
import { useLogger } from 'src/states/app';
import { HostService, HostToGuestPeer } from 'src/services/host-service';
import HostStages from 'src/components/stages/host-stages';
import VolumeHandler from 'src/components/common/volume-handler';

const Host = () => {
  const [service, setService] = useState<HostService>();
  const [currentPeer, setCurrentPeer] = useState<HostToGuestPeer | undefined>();
  const logger = useLogger();
  const audioRef = useRef<HTMLAudioElement>(null);
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
      {!service && <Host00Init setService={setService} setCurrentPeer={setCurrentPeer} playAudio={playAudio} />}
      {service && currentPeer != null && (
        <HostStages service={service} peer={currentPeer} setCurrentPeer={setCurrentPeer} />
      )}
      <AudioControl audioRef={audioRef} />
      {service && <VolumeHandler service={service} />}
    </main>
  );
};

export default Host;
