import type { CommonStation } from 'types/station';
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

export interface SBBStation extends CommonStation {
  location: SBBCoordinates;
}
