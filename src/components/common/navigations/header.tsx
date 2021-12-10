/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';
import ModeChanger from 'src/components/common/navigations/mode-changer';
import { useTheme } from 'src/theme';

const Header = () => {
  const { color } = useTheme();
  return (
    <header
      css={css({
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100%',
        paddingLeft: '0.5rem',
        paddingRight: '1rem',
        background: color.background.light,
      })}
    >
      <span>QR WebRTC</span>
      <ModeChanger />
    </header>
  );
};

export default Header;
