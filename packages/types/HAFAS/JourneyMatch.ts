import type { Common, Journey, JourneyFilter, ParsedProduct, RemL } from '.';
import type { Route$Stop } from 'types/routing';

export interface JourneyMatchRequest {
  req: {
    jnyFltrL?: JourneyFilter[];
    date: string;
    dateB?: string;
    dateE?: string;
    extId?: string;
    input: string;

    onlyCR?: boolean;
    onlyRT?: boolean;
    onlyTN?: boolean;
    time?: string;
    timeE?: string;
    timeB?: string;
    tripId?: string;
    useAeqi?: boolean;
  };
  meth: 'JourneyMatch';
}

export interface JourneyMatchResponse {
  common: Common;
  jnyL: Journey[];
  fpB: string;
  fpE: string;
  planrtTS: string;
}

export interface ParsedJourneyMatchResponse {
  train: ParsedProduct;
  stops: Route$Stop[];
  jid: string;
  firstStop: Route$Stop;
  lastStop: Route$Stop;
  messages?: RemL[];
}
export interface JourneyMatchOptions {
  trainName: string;
  initialDepartureDate?: number;
  jnyFltrL?: JourneyFilter[];
}
