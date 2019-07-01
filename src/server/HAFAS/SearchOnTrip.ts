import { AllowedHafasProfile, HafasResponse, ParsedCommon } from 'types/HAFAS';
import { Journey } from './TripSearch/parse';
import {
  SearchOnTripRequest,
  SearchOnTripResponse,
} from 'types/HAFAS/SearchOnTrip';
import makeRequest from './Request';

const parseSearchOnTrip = (
  d: HafasResponse<SearchOnTripResponse>,
  common: ParsedCommon
) => {
  const journey = new Journey(d.svcResL[0].res.outConL[0], common).journey;

  return {
    ...journey,
    raw: d.svcResL[0].res,
  };
};

export default (ctxRecon: string, profile?: AllowedHafasProfile) => {
  const req: SearchOnTripRequest = {
    req: { ctxRecon, sotMode: 'RC' },
    meth: 'SearchOnTrip',
  };

  return makeRequest(req, parseSearchOnTrip, profile);
};
