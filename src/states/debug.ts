import { atomWithImmer } from 'jotai/immer';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debugAtom = atomWithImmer<{ [key: string]: any }>({});
