/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import ModeChanger from 'src/components/common/navigations/mode-changer';
import { useTheme } from 'src/theme';

const Header = () => {
  const { color } = useTheme();
  const [version, setVersion] = useState('');
  useEffect(() => {
    const scripts = Array.from(document.getElementsByTagName('script'));
    for (const script of scripts) {
      const m = /index\.([^.]+)\.js$/.exec(script.src);
      if (m) {
        setVersion(m[1]);
        break;
      }
    }
  }, []);
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
      <span>QR WebRTC{version ? ` -${version}` : ''}</span>
      <ModeChanger />
    </header>
  );
};

export default Header;
