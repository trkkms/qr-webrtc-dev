/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';
import { useAtom } from 'jotai';
import { modeAtom, startAtom, useLogger } from 'src/states/app';
import { useAtomValue } from 'jotai/utils';
import classNames from 'classnames';
import { useTheme } from 'src/theme';

const ModeChanger = () => {
  const [mode, setMode] = useAtom(modeAtom);
  const started = useAtomValue(startAtom);
  const logger = useLogger();
  const { color } = useTheme();
  const current = mode === 'host' ? 'ホスト' : 'ゲスト';
  const target = mode === 'host' ? 'ゲスト' : 'ホスト';
  return (
    <button
      className={classNames({ started })}
      css={css({
        width: '9rem',
        border: 'none',
        outline: 'none',
        padding: '0.125rem 0.5rem',
        background: `linear-gradient(135deg, ${color.primary.main} 50%, ${color.secondary.main} 50%)`,
        color: color.primary.text,
        '&.started': {
          background: color.background.dark,
          color: color.text,
        },
      })}
      type="button"
      onClick={() => {
        if (started) {
          logger.warn('セッションが開始されています。モードを変更できません。');
          return;
        }
        setMode((mode) => (mode === 'host' ? 'guest' : 'host'));
      }}
      disabled={started}
    >
      {started ? (
        <span>{current}</span>
      ) : (
        <>
          <span css={css({ fontWeight: 'bolder' })}>{`[${current}]`}</span>
          {' ⇒ '}
          <span>{target}</span>
        </>
      )}
    </button>
  );
};

export default ModeChanger;
