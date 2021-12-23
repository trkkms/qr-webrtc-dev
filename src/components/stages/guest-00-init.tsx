/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';
import { GuestService, initializeGuest } from 'src/services/guest-service';
import { cameraStreamAtom, startAtom, useLogger } from 'src/states/app';
import { useTheme } from 'src/theme';
import { useAtom } from 'jotai';
import { guestNameAtom, guestStageAtom } from 'src/states/guest';
import { useUpdateAtom } from 'jotai/utils';
import { useUpdateConnectionState } from 'src/common/hooks/util';
import { getVideoStream } from 'src/common/media';

namespace Guest00Init {
  export interface Props {
    setService: (service: GuestService) => void;
    playAudio: (stream: MediaStream) => Promise<void>;
  }
}

const Guest00Init = ({ setService, playAudio }: Guest00Init.Props) => {
  const logger = useLogger();
  const { color } = useTheme();
  const setStart = useUpdateAtom(startAtom);
  const [name, setGuestName] = useAtom(guestNameAtom);
  const updateStages = useUpdateAtom(guestStageAtom);
  const onStateChange = useUpdateConnectionState();
  const setCameraStream = useUpdateAtom(cameraStreamAtom);
  return (
    <div
      css={css({
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
      })}
    >
      <div
        css={css({
          width: '100%',
          padding: '2rem',
        })}
      >
        <div
          css={css({
            display: 'flex',
            width: '100%',
            justifyContent: 'center',
            marginBottom: '3rem',
          })}
        >
          <input
            type="text"
            css={css({
              outline: 'none',
              border: 'none',
              fontSize: '1rem',
              padding: '0.25rem 0.5rem',
              height: '3rem',
              width: '14rem',
            })}
            onChange={(e) => {
              setGuestName(e.target.value);
            }}
            value={name}
          />
        </div>
        <div css={css({ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' })}>
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
              setCameraStream(await getVideoStream());
              const service = await initializeGuest(playAudio, logger, name, onStateChange);
              setService(service);
              setStart(true);
              updateStages((stages) => {
                stages.push({ stage: 1 });
              });
            }}
          >
            接続開始
          </button>
        </div>
      </div>
    </div>
  );
};

export default Guest00Init;
