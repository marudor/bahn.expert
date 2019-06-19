// import { HafasResponse } from 'types/HAFAS';
import { LocGeoPosRequest } from 'types/HAFAS/LocGeoPos';
import makeRequest from './Request';

export default (x: number, y: number, maxDist: number) => {
  const req: LocGeoPosRequest = {
    req: {
      ring: {
        maxDist,
        cCrd: {
          x,
          y,
        },
      },
    },
    meth: 'LocGeoPos',
  };

  return makeRequest(req);
};
