import { CommonStation } from '../station';
import { SBBCoordinates } from 'types/SBB/common';

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
