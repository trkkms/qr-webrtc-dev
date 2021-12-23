import { useMemo } from 'react';
import { compress } from 'wasm';
import { AppLogger } from 'src/states/app';

export const useCompressedSDP = (
  sdp: string,
  part: 1 | 2,
  logger: AppLogger,
  compressDeps: unknown[],
  srcDeps: unknown[],
): Uint8Array | undefined => {
  const compressed = useMemo(() => {
    const ary = compress(sdp);
    if (ary == null) {
      logger.error('Failed to compress sdp.');
      return undefined;
    }
    return new Uint8Array(ary);
  }, compressDeps);
  return useMemo(() => {
    console.log('original bytes', new Blob([sdp]).size);
    console.log('compressed', compressed);
    return compressed == null
      ? undefined
      : part === 1
      ? compressed.subarray(0, compressed.length / 2)
      : compressed.subarray(compressed.length / 2);
  }, srcDeps);
};
