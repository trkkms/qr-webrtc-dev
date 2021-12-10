/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';

namespace Guest05ConnectionList {
  export interface Props {
    children?: React.ReactNode | undefined;
  }
}

const Guest05ConnectionList = ({ children }: Guest05ConnectionList.Props) => {
  return <p css={css({ fontSize: 'smaller' })}>{children ?? 'This Component is not implemented yet.'}</p>;
};

export default Guest05ConnectionList;
