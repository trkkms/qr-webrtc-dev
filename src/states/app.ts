import { useCallback } from 'react';
import { atom } from 'jotai';
import { atomWithHash, useAtomValue, useUpdateAtom } from 'jotai/utils';
import { atomWithImmer } from 'jotai/immer';
import { nanoid } from 'nanoid';

export const startAtom = atom(false);

export const modeAtom = atomWithHash<'host' | 'guest'>('as', 'host', {
  replaceState: true,
  serialize: (v) => v,
  deserialize: (v) => (v === 'host' ? 'host' : 'guest'),
});

export type LogLevel = 'info' | 'warn' | 'error' | 'success';
export interface LogItem {
  message: string;
  timestamp: Date;
  level: LogLevel;
  id: string;
}

const logState = atomWithImmer<LogItem[]>([]);

interface LoggerFn {
  (message: string): void;
}

export type AppLogger = {
  [key in LogLevel]: LoggerFn;
};

export const useLogs = (): LogItem[] => useAtomValue(logState);

export const useLogger = (): AppLogger => {
  const update = useUpdateAtom(logState);
  const createLogger = (level: LogLevel) =>
    useCallback((message: string) => {
      const logMethod = level === 'info' || level === 'success' ? 'log' : level;
      console[logMethod](message);
      const timestamp = new Date();
      const id = nanoid();
      return update((prev) => {
        prev.unshift({ message, timestamp, level, id });
      });
    }, []);
  return {
    info: createLogger('info'),
    warn: createLogger('warn'),
    error: createLogger('error'),
    success: createLogger('success'),
  };
};

interface VolumeState {
  mic: {
    volume: number;
    muted: boolean;
  };
  speaker: {
    volume: number;
    muted: boolean;
    unlockLimit: boolean;
  };
}

export const volumeAtom = atomWithImmer<VolumeState>({
  mic: { volume: 1, muted: false },
  speaker: { volume: 1, muted: false, unlockLimit: false },
});

export const cameraStreamAtom = atom<MediaStream | undefined>(undefined);
