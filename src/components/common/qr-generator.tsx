/** @jsxImportSource @emotion/react */
import React, { useEffect, useMemo, useRef } from 'react';
import { into_svg } from 'wasm';
import { useLogger } from 'src/states/app';

namespace QrGenerator {
  export interface Props {
    src: Uint8Array;
    cacheKey: string;
  }
}

interface Cache {
  [key: string]: string | undefined;
}

const QrGenerator = ({ src, cacheKey }: QrGenerator.Props) => {
  const cache = useRef<Cache>({});
  const logger = useLogger();
  const qrRaw = useMemo(() => {
    const cached = cache.current[cacheKey];
    if (cached) {
      return cached;
    }
    const svg = into_svg(src, 300);
    if (svg === undefined) {
      logger.error('QR Code creation failed for some reason.');
      return '';
    }
    cache.current[cacheKey] = svg;
    return svg;
  }, [src, cacheKey]);
  useEffect(() => {
    console.log(`${cacheKey} generate:`);
    console.log(src);
  }, [src, cacheKey]);
  return <div dangerouslySetInnerHTML={{ __html: qrRaw }} />;
};

export default QrGenerator;
