import { Journey } from './TripSearch/parse';
import makeRequest from './Request';
import type {
  AllowedHafasProfile,
  HafasResponse,
  ParsedCommon,
} from 'types/HAFAS';
import type {
  SearchOnTripRequest,
  SearchOnTripResponse,
} from 'types/HAFAS/SearchOnTrip';
import type { SingleRoute } from 'types/routing';

const parseSearchOnTrip = (
  d: HafasResponse<SearchOnTripResponse>,
  common: ParsedCommon,
) => {
  return new Journey(d.svcResL[0].res.outConL[0], common).journey;
};

export default (
  req: SearchOnTripRequest['req'],
  profile?: AllowedHafasProfile,
  raw?: boolean,
): Promise<SingleRoute> => {
  const request: SearchOnTripRequest = {
    req,
    meth: 'SearchOnTrip',
  };

  return makeRequest(request, raw ? undefined : parseSearchOnTrip, profile);
};
