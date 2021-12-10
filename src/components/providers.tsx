/** @jsxImportSource @emotion/react */
import React from 'react';
import { Provider as Jotai } from 'jotai';

namespace Providers {
  export interface Props {
    children?: React.ReactNode | undefined;
  }
}

const Providers = ({ children }: Providers.Props) => {
  return <Jotai>{children}</Jotai>;
};

export default Providers;
