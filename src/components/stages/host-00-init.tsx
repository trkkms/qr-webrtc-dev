/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';
import { useTheme } from 'src/theme';
import { HostService, HostToGuestPeer, initializeHost } from 'src/services/host-service';
import { useUpdateAtom } from 'jotai/utils';
import { startAtom, useLogger } from 'src/states/app';
import { hostStageAtom } from 'src/states/host';
import { useUpdateConnectionState } from 'src/common/hooks/util';

namespace Host00Init {
  export interface Props {
    setService: (service: HostService) => void;
    setCurrentPeer: (peer: HostToGuestPeer) => void;
    playAudio: (stream: MediaStream) => Promise<void>;
  }
}

const Host00Init = ({ setService, setCurrentPeer, playAudio }: Host00Init.Props) => {
  const { color } = useTheme();
  const setStart = useUpdateAtom(startAtom);
  const updateStages = useUpdateAtom(hostStageAtom);
  const logger = useLogger();
  const onStateChange = useUpdateConnectionState();
  return (
    <div css={css({ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' })}>
      <button
        type="button"
        css={css({
          padding: '0.5rem 1rem',
          outline: 'none',
          border: 'none',
          background: color.primary.main,
          color: color.primary.text,
          fontSize: '1.5rem',
          width: '14rem',
        })}
        onClick={async () => {
          const service = await initializeHost(playAudio, logger, onStateChange);
          const peer = await service.createPeer();
          setService(service);
          setStart(true);
          setCurrentPeer(peer);
          updateStages((stages) => {
            console.log('offer sdp:', peer.sdp);
            stages.push({ stage: 1, sdp: peer.sdp });
          });
        }}
      >
        接続開始
      </button>
    </div>
  );
};

export default Host00Init;
