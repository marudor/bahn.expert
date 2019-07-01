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

export interface SearchOnTripRequest {
  req: {
    ctxRecon: string;
    sotMode: 'RC';
  };
  meth: 'SearchOnTrip';
}

export interface ParsedSearchOnTripResponse extends Route$JourneySegmentTrain {
  currentStop?: Route$Stop;
}
