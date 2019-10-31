import { Common } from '.';
import { OutConL, SotCtxt } from './TripSearch';
import { Route$JourneySegmentTrain, Route$Stop } from 'types/routing';

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

export interface SearchOnTripRequest {
  req: SearchOnTripJIDRequest | SearchOnTripCTXRequest;
  meth: 'SearchOnTrip';
}

export interface ParsedSearchOnTripResponse extends Route$JourneySegmentTrain {
  currentStop?: Route$Stop;
}
