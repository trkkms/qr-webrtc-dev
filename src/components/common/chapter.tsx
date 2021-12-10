/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';

namespace Chapter {
  export interface Props {
    title: string;
    children?: React.ReactNode | undefined;
  }
}

const Chapter = ({ title, children }: Chapter.Props) => {
  return (
    <section css={css({ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: '100%', padding: '1rem' })}>
      <h2 css={css({ width: '100%', marginBottom: '1rem', fontSize: 'larger' })}>{title}</h2>
      {children}
    </section>
  );
};

export default Chapter;
