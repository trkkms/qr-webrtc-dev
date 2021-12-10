/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';

namespace Promised {
  export interface Props<T> {
    children: (prop: T) => React.ReactElement | null;
  }
}

const Promised = <T,>({ children }: Promised.Props<T>) => {
  return <p css={css({ fontSize: 'smaller' })}>{children ?? 'This Component is not implemented yet.'}</p>;
};

export default Promised;
