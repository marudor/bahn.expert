import { HafasResponse, HafasStation, ParsedCommon } from 'types/HAFAS';
import { LocGeoPosRequest, LocGeoPosResponse } from 'types/HAFAS/LocGeoPos';
import makeRequest from './Request';

const parseLocGeoPos = (
  _: HafasResponse<LocGeoPosResponse>,
  common: ParsedCommon
) => common.locL;

export default (
  x: number,
  y: number,
  maxDist: number
): Promise<HafasStation[]> => {
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

  return makeRequest(req, parseLocGeoPos);
};
