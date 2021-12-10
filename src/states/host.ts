import { atomWithImmer } from 'jotai/immer';

export interface Host01 {
  stage: 1;
  sdp: string;
}
export interface Host02 {
  stage: 2;
}
export interface Host03 {
  stage: 3;
  halfAnswer: number[];
}
export interface Host04 {
  stage: 4;
  sdp: string;
}
export interface Host05 {
  stage: 5;
}

export type HostStage = Host01 | Host02 | Host03 | Host04 | Host05;

export const hostStageAtom = atomWithImmer<HostStage[]>([]);
