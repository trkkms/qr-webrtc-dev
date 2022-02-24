/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';
import { useAtom } from 'jotai';
import { volumeAtom } from 'src/states/app';
import { useTheme } from 'src/theme';

const VolumeUnlock = () => {
  const [volumes, setVolumes] = useAtom(volumeAtom);
  const { color } = useTheme();
  return (
    <div css={css({ width: '100%', marginTop: '3rem' })}>
      <div
        css={css({
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        })}
      >
        {!volumes.speaker.unlockLimit && (
          <button
            css={css({
              width: '100%',
              maxWidth: '500px',
              height: '2rem',
              border: 'none',
              outline: 'none',
              background: color.alert.main,
            })}
            onClick={() => {
              setVolumes((draft) => {
                draft.speaker.unlockLimit = true;
              });
            }}
          >
            ボリュームアンロック
          </button>
        )}
        {volumes.speaker.unlockLimit && (
          <button
            css={css({
              width: '100%',
              maxWidth: '500px',
              height: '2rem',
              border: 'none',
              outline: 'none',
              background: color.alert.main,
            })}
            onClick={() => {
              if (volumes.speaker.volume > 1.0) {
                setVolumes((draft) => {
                  draft.speaker.volume = 1.0;
                });
              }
              setVolumes((draft) => {
                draft.speaker.unlockLimit = false;
              });
            }}
          >
            ボリューム上限ロック
          </button>
        )}
      </div>
      <p>イヤホンを利用している場合、アンロックすると非常に大きな音が出る場合があります。</p>
    </div>
  );
};

export default VolumeUnlock;
