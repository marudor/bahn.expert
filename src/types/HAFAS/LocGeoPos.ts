import type { Common, GeoRect, GeoRing, LocationFilter } from '.';

interface BaseGeoPosRequest {
  date?: string;
  getEvents?: boolean;
  getPOIs?: boolean;
  getStops?: boolean;
  locFltrL?: LocationFilter;
  maxLoc?: number;
  period?: number;
  time?: string;
  zoom?: number;
}

interface RingGeoPosRequest extends BaseGeoPosRequest {
  ring: GeoRing;
}

interface RectGeoPosRequest extends BaseGeoPosRequest {
  rect: GeoRect;
}

export interface LocGeoPosRequest {
  req: RingGeoPosRequest | RectGeoPosRequest;
  meth: 'LocGeoPos';
}

export interface LocGeoPosResponse {
  common: Common;
}
