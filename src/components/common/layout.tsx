/** @jsxImportSource @emotion/react */
import React from 'react';
import { css, Global } from '@emotion/react';
import Header from 'src/components/common/navigations/header';
import Footer from 'src/components/common/navigations/footer';
import { useTheme } from 'src/theme';

namespace Layout {
  export interface Props {
    children?: React.ReactNode | undefined;
  }
}

const Layout = ({ children }: Layout.Props) => {
  const { color } = useTheme();
  return (
    <>
      <div css={css({ display: 'grid', width: '100%', height: '100vh', gridTemplateRows: '2.5rem 1fr auto' })}>
        <div css={css({ height: '100%' })}>
          <Header />
        </div>
        <div css={css({ height: '100%', display: 'flex', justifyContent: 'center' })}>{children}</div>
        <div css={css({ height: '100%' })}>
          <Footer />
        </div>
      </div>
      <Global
        styles={css({
          '*': {
            boxSizing: 'border-box',
            margin: 0,
            padding: 0,
          },
          'ul, ol': {
            margin: 0,
            padding: 0,
            listStyleType: 'none',
          },
          body: {
            background: color.background.main,
            color: color.text,
            margin: 0,
            padding: 0,
          },
        })}
      />
    </>
  );
};

export default Layout;
