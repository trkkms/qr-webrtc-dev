import React, { useLayoutEffect } from 'react';
import Host from 'src/components/pages/host';
import Guest from 'src/components/pages/guest';
import Layout from 'src/components/common/layout';
import { useAtomValue, useUpdateAtom } from 'jotai/utils';
import { modeAtom } from 'src/states/app';
import init from 'wasm';

const App = () => {
  const mode = useAtomValue(modeAtom);
  const setMode = useUpdateAtom(modeAtom);
  useLayoutEffect(() => {
    init().catch((e: unknown) => {
      console.error(e);
    });
    const params = new URLSearchParams(window.location.hash.substring(1));
    const mode = params.get('as') || 'host';
    setMode(mode === 'host' ? 'host' : 'guest');
  }, []);
  return <Layout>{mode === 'host' ? <Host /> : <Guest />}</Layout>;
};

export default App;
