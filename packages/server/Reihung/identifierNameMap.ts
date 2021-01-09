import type { AvailableIdentifier, BRInfo } from 'types/reihung';

const nameMap: {
  [K in AvailableIdentifier]: string;
} = {
  '401': 'ICE 1 (BR401)',
  '401.9': 'ICE 1 Kurz (BR401)',
  '401.LDV': 'ICE 1 LDV (BR401)',
  '402': 'ICE 2 (BR402)',
  '403': 'ICE 3 (BR403)',
  '403.S1': 'ICE 3 (BR403 1. Serie)',
  '403.S1R': 'ICE 3 (BR403 1. Serie Redesign)',
  '403.S2': 'ICE 3 (BR403 2. Serie)',
  '403.S2R': 'ICE 3 (BR403 2. Serie Redesign)',
  '403.R': 'ICE 3 (BR403 Redesign)',
  '406': 'ICE 3 (BR406)',
  '406.R': 'ICE 3 (BR406 Redesign)',
  '407': 'ICE 3 Velaro (BR407)',
  '410.1': 'ICE S (BR410.1)',
  '411': 'ICE T (BR411)',
  '411.S1': 'ICE T (BR411 1. Serie)',
  '411.S2': 'ICE T (BR411 2. Serie)',
  '412': 'ICE 4 (BR412)',
  '412.7': 'ICE 4 Kurz (BR412)',
  '412.13': 'ICE 4 Lang (BR412)',
  '415': 'ICE T Kurz (BR415)',
  'IC2.TWIN': 'IC 2 (Twindexx)',
  'IC2.KISS': 'IC 2 (KISS)',
  MET: 'MET',
  TGV: 'TGV',
};

export function getName(br: Omit<BRInfo, 'name'>): string | undefined {
  if (br.identifier) return nameMap[br.identifier];
}
