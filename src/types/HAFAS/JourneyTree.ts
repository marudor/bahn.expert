import type { GeoRect, GeoRing, HimFilter, JourneyFilter } from 'types/HAFAS';

export interface JourneyTreeRequestOptions {
  getChilds?: number;
  getHIM?: boolean;
  getParent?: boolean;
  getStatus?: boolean;
  himFltrL?: HimFilter[];
  jnyFltrL?: JourneyFilter[];
  pid?: string;
  rect?: GeoRect;
  ring?: GeoRing;
}

export interface JourneyTreeRequest {
  req: JourneyTreeRequestOptions;
  meth: 'JourneyTree';
}

export type JourneyTreeResponse = any;
