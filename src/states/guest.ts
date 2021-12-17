import { atomWithImmer } from 'jotai/immer';
import { atomWithStorage } from 'jotai/utils';

export const guestNameAtom = atomWithStorage('guestName', 'ななしさん');

export interface Guest01 {
  stage: 1;
}
export interface Guest02 {
  stage: 2;
  halfOffer: number[];
}
export interface Guest03 {
  stage: 3;
  sdp: string;
}
export interface Guest04 {
  stage: 4;
}
export interface Guest05 {
  stage: 5;
}
export type GuestStage = Guest01 | Guest02 | Guest03 | Guest04 | Guest05;
export const guestStageAtom = atomWithImmer<GuestStage[]>([]);
