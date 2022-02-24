/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';
import { useAtom } from 'jotai';
import { volumeAtom } from 'src/states/app';

interface ControllerItemProp {
  value: number;
  onMuteClick: () => void;
  setValue: (value: string) => void;
  icon: string;
  unlock: boolean;
}

const ControllerItem = ({ value, setValue, onMuteClick, icon, unlock }: ControllerItemProp) => {
  return (
    <div css={css({ display: 'block' })}>
      <input
        type="range"
        step={unlock ? 0.1 : 0.01}
        min={0.0}
        max={unlock ? 8.0 : 1.0}
        value={value}
        onChange={(e) => {
          setValue(e.currentTarget.value);
        }}
      />
      <button
        css={css({ outline: 'none', border: 'none', background: 'transparent' })}
        type="button"
        onClick={onMuteClick}
      >
        {icon}
      </button>
    </div>
  );
};

const VolumeController = () => {
  const [volumes, setVolumes] = useAtom(volumeAtom);
  return (
    <div css={css({ display: 'flex', alignItems: 'center', justifyContent: 'space-around', width: '100%' })}>
      <div css={css({ display: 'block' })}>
        <ControllerItem
          value={volumes.mic.volume}
          onMuteClick={() => {
            setVolumes((draft) => {
              draft.mic.muted = !draft.mic.muted;
            });
          }}
          setValue={(value) => {
            setVolumes((draft) => {
              draft.mic.volume = Number(value);
            });
          }}
          icon={volumes.mic.muted ? '🔕' : '🎤'}
          unlock={false}
        />
      </div>
      <div css={css({ display: 'block' })}>
        <ControllerItem
          value={volumes.speaker.volume}
          onMuteClick={() => {
            setVolumes((draft) => {
              draft.speaker.muted = !draft.speaker.muted;
            });
          }}
          setValue={(value) => {
            setVolumes((draft) => {
              draft.speaker.volume = Number(value);
            });
          }}
          icon={volumes.speaker.muted ? '🔇' : '🔊'}
          unlock={volumes.speaker.unlockLimit}
        />
      </div>
    </div>
  );
};

export default VolumeController;
