import { atom } from 'jotai';
import { useAtomValue, useUpdateAtom } from 'jotai/utils';
import { useCallback } from 'react';

const connectionStateAtom = atom<unknown>({});
export const useUpdateConnectionState = (): (() => void) => {
  const update = useUpdateAtom(connectionStateAtom);
  return useCallback(() => {
    update(Symbol());
  }, []);
};
export const useConnectionStateDetection = (): void => {
  useAtomValue(connectionStateAtom);
};
