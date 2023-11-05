import type {
  Common,
  GenericHafasRequest,
  Journey,
  JourneyFilter,
  ParsedProduct,
  RemL,
} from '.';
import type { RouteStop } from '@/types/routing';

interface JounreyMatchRequestRes {
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
}
export interface JourneyMatchRequest
  extends GenericHafasRequest<'JourneyMatch', JounreyMatchRequestRes> {}

export interface JourneyMatchResponse {
  common: Common;
  jnyL: Journey[];
  fpB: string;
  fpE: string;
  planrtTS: string;
}

export interface ParsedJourneyMatchResponse {
  train: ParsedProduct;
  stops: RouteStop[];
  jid: string;
  firstStop: RouteStop;
  lastStop: RouteStop;
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
