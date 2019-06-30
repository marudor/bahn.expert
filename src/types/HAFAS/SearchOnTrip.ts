import { Common } from '.';
import { OutConL, SotCtxt } from './TripSearch';

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
