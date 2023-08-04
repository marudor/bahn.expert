import type {
  CommonProductInfo,
  CommonStopInfo,
  HafasStation,
} from '@/types/HAFAS';
import type { MinimalStopPlace } from '@/types/stopPlace';

export interface IrisStationWithRelated {
  station: IrisStation;
  relatedStations: IrisStation[];
}

export interface IrisStation {
  name: string;
  meta: string[];
  eva: string;
  ds100: string;
  db: string;
  creationts: string;
  p: string;
}
export interface WingInfo {
  station: {
    id: string;
    title: string;
  };
  pt: Date;
  fl: boolean;
}

export interface WingDefinition {
  start?: WingInfo;
  end?: WingInfo;
}

/**
 * @isInt strike
 */
export interface AbfahrtenResult {
  /**
   * Journeys that have not yet departed (or arrived if they end here)
   */
  departures: Abfahrt[];
  /**
   * Journeys that have already departed (or arrived if they end here)
   */
  lookbehind: Abfahrt[];
  wings?: Wings;
  /**
   * amount of departures/arrivals that are affected by a strike [Streik]
   */
  strike?: number;
  /**
   * Eva Numbers queried for this resultset
   */
  stopPlaces: string[];
}

export interface Abfahrt {
  initialDeparture: Date;
  /**
   * evaNumber of first stopPlace in route
   */
  initialStopPlace: string;
  arrival?: StopInfo;
  currentStopPlace: MinimalStopPlace;
  departure?: StopInfo;
  destination: string;
  id: string;
  /**
   * Is this stop unplanned and additional?
   */
  additional?: boolean;
  /**
   * Is this stop cancelled for this journey?
   */
  cancelled?: boolean;
  mediumId: string;
  messages: Messages;
  platform: string;
  /**
   * Most likely D | N | S | F
   */
  productClass: string;
  rawId: string;
  ref?: SubstituteRef;
  route: Stop[];
  scheduledDestination: string;
  scheduledPlatform: string;
  substitute?: boolean;
  train: TrainInfo;
  /**
   * Sofern Durchbindung passiert ist steht hier der vorherige Transport drin. Is fachlich ultra hacky.
   */
  previousTrain?: TrainInfo;
}

export interface IrisMessage {
  text: string;
  timestamp?: Date;
  superseded?: boolean;
  priority?: MessagePrio;
  value?: number;
}

export interface HimIrisMessage extends IrisMessage {
  head: string;
  stopPlace?: HafasStation;
}

export type Message = IrisMessage | HimIrisMessage;

/**
 * 1: High; 2: Medium; 3: Low; 4: Done
 */

export type MessagePrio = '1' | '2' | '3' | '4';
export interface Messages {
  [name: string]: Message[];
  qos: IrisMessage[];
  delay: IrisMessage[];
  him: HimIrisMessage[];
}

export interface StopInfo extends CommonStopInfo {
  /**
   * MediumIds of journeys that are wings of this journey at this stop.
   */
  wingIds?: string[];
  cancelled?: boolean;
  hidden?: boolean;
  /**
   * Durchbindung? Zug wechselt die Kategorie, theoretisch aber sogar Zugnummer?
   */
  transition?: string;
}

export interface SubstituteRef {
  trainNumber: string;
  trainType: string;
  train: string;
}

export interface Stop {
  additional?: boolean;
  cancelled?: boolean;
  showVia?: boolean;
  name: string;
}

export interface TrainInfo extends CommonProductInfo {
  type: string;
  number: string;
}

/**
 * Map of "mediumId" to Abfahrt.
 */
export type Wings = Record<string, Abfahrt>;
