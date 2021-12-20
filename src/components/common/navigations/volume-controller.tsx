/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';
import { useAtom } from 'jotai';
import { volumeAtom } from 'src/states/app';

const VolumeController = () => {
  const [volumes, setVolumes] = useAtom(volumeAtom);
  return (
    <div css={css({ display: 'flex', alignItems: 'center', justifyContent: 'space-around', width: '100%' })}>
      {/*<div>*/}
      {/*  <input*/}
      {/*    type="range"*/}
      {/*    step={0.01}*/}
      {/*    min={0.0}*/}
      {/*    max={1.0}*/}
      {/*    value={volumes.mic.volume}*/}
      {/*    onChange={(e) => {*/}
      {/*      setVolumes((draft) => {*/}
      {/*        draft.mic.volume = Number(e.currentTarget.value);*/}
      {/*      });*/}
      {/*    }}*/}
      {/*  />*/}
      {/*</div>*/}
      <div css={css({ display: 'block' })}>
        <input
          type="range"
          step={0.01}
          min={0.0}
          max={1.0}
          value={volumes.speaker.volume}
          onChange={(e) => {
            setVolumes((draft) => {
              draft.speaker.volume = Number(e.currentTarget.value);
            });
          }}
        />
        <button
          css={css({ outline: 'none', border: 'none', background: 'transparent' })}
          type="button"
          onClick={() => {
            setVolumes((draft) => {
              draft.speaker.muted = !draft.speaker.muted;
            });
          }}
        >
          {volumes.speaker.muted ? '🔇' : '🔊'}
        </button>
      </div>
    </div>
  );
};

export default VolumeController;
