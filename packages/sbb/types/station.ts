import type { SBBCoordinates } from 'sbb/types/common';

export interface SBBStationResult {
  standorte?: RawSBBStation[];
}

export interface RawSBBStation extends SBBCoordinates {
  displayName: string;
  externalId: string;
  type: 'STATION';
  barriereFreiheit: null | 'SELBSTAENDIG';
}

export interface SBBStation {
  location: SBBCoordinates;
  title: string;
  id: string;
}
