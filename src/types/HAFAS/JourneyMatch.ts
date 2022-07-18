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
  /**
   * Usually "<Gattung> <Fahrtnummer>"
   * @example "ICE 23"
   * @Example "Bus 94212"
   */
  trainName: string;
  /**
   * Used to find the correct journey for a specific day.
   * @default now
   */
  initialDepartureDate?: Date;
  /**
   * These are raw HAFAS Filter and quite advanced.
   */
  jnyFltrL?: JourneyFilter[];

  onlyRT?: boolean;
}

export interface EnrichedJourneyMatchOptions extends JourneyMatchOptions {
  limit?: number;
  // Only FV, will also use "onlyRT" (unknown what  the exact purpose is)
  filtered?: boolean;
}
