import { Common } from '.';

export interface LocGeoPosRequest {
  req: {
    ring: {
      maxDist: number;
      cCrd: {
        x: number;
        y: number;
      };
    };
  };
  meth: 'LocGeoPos';
}

export interface LocGeoPosResponse {
  common: Common;
}
