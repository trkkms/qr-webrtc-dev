/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import classNames from 'classnames';
import Logs from 'src/components/common/navigations/logs';
import { useTheme } from 'src/theme';
import { useLogs } from 'src/states/app';
import VolumeController from 'src/components/common/navigations/volume-controller';

const Footer = () => {
  const [open, setOpen] = useState(false);
  const { color } = useTheme();
  const logs = useLogs();
  const errorOnTop = logs.length > 0 && logs[logs.length - 1].level === 'error';
  useEffect(() => {
    if (errorOnTop) {
      setOpen(true);
    }
  }, [errorOnTop]);
  return (
    <footer
      className={classNames({ open })}
      css={css({
        display: 'grid',
        height: '3.5rem',
        gridTemplateRows: '2rem 1.5rem 1fr',
        overflow: 'hidden',
        transition: 'all 0.5s',
        '&.open': {
          height: '12rem',
        },
        background: color.background.dark,
        color: color.text,
      })}
    >
      <div
        css={css({
          display: 'flex',
          alignItems: 'center',
          borderBottom: `1px solid ${color.primary.dark}`,
          width: '100%',
        })}
      >
        <VolumeController />
      </div>
      <button
        type="button"
        className={classNames({ error: errorOnTop })}
        css={css({
          display: 'flex',
          justifyContent: 'right',
          alignItems: 'center',

          width: '100%',
          height: '100%',
          paddingRight: '1rem',

          border: 'none',
          outline: 'none',

          background: color.background.dark,
          color: color.text,
          '&.error': {
            background: '#b61827',
          },
        })}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span css={css({ marginRight: '0.75rem' })}>ログ</span>
        <span
          className={classNames({ open })}
          css={css({
            display: 'inline-block',
            height: '0.75rem',
            width: '0.75rem',
            borderLeft: '0.375rem solid transparent',
            borderBottom: '0.75rem solid white',
            borderRight: '0.375rem solid transparent',
            transition: 'all 0.5s',
            '&.open': {
              transform: 'rotate(-180deg)',
            },
          })}
        />
      </button>
      <div
        css={css({
          height: '100%',
          overflowY: 'scroll',
          borderTop: `1px solid ${color.primary.dark}`,
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        })}
      >
        <Logs items={logs} />
      </div>
    </footer>
  );
};

export default Footer;
