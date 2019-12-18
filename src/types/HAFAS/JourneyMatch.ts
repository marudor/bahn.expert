import { Common, Journey, JourneyFilter, ParsedProduct, RemL } from '.';
import { Route$Stop } from 'types/routing';

export interface JourneyMatchRequest {
  req: {
    jnyFltrL?: JourneyFilter[];
    date: string;
    input: string;
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
