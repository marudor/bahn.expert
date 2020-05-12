import { CommonStation } from '../station';

export interface SBBStationResult {
  standorte?: RawSBBStation[];
}

export interface RawSBBStation {
  displayName: string;
  externalId: string;
  type: 'STATION';
  longitude: number;
  latitude: number;
  barriereFreiheit: null;
}

export interface SBBStation extends CommonStation {
  location: {
    latitude: number;
    longitude: number;
  };
}
