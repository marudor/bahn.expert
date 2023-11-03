import type { Common, GenericHafasRequest, ParsedPolyline } from '.';
import type { HimIrisMessage } from '@/types/iris';
import type { OutConL, SotCtxt } from './TripSearch';
import type { RouteJourneySegmentTrain, RouteStop } from '@/types/routing';

export interface SearchOnTripResponse {
  common: Common;
  fpB: string;
  fpE: string;
  bfATS: number;
  bflOSTS: number;
  planrtTS: number;
  sotCtxt: SotCtxt;
  outConL: OutConL[];
}

export type AllowedSotMode = 'JI' | 'RC';
interface SearchOnTripJIDRequest {
  jid: string;
  sotMode: 'JI';
}

interface SearchOnTripCTXRequest {
  ctxRecon: string;
  sotMode: 'RC';
}

export interface SearchOnTripRequest
  extends GenericHafasRequest<
    'SearchOnTrip',
    SearchOnTripJIDRequest | SearchOnTripCTXRequest
  > {}

export interface ParsedSearchOnTripResponse extends RouteJourneySegmentTrain {
  himMessages?: HimIrisMessage[];
  currentStop?: RouteStop;
  polyline?: ParsedPolyline;
}
