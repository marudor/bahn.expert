import type {
  CommonProductInfo,
  CommonStopInfo,
  HafasStation,
} from 'types/HAFAS';
import type { MinimalStopPlace } from 'types/stopPlace';

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

export interface AbfahrtenResult {
  departures: Abfahrt[];
  lookbehind: Abfahrt[];
  wings?: Wings;
  // @isInt
  strike?: number;
}

export interface Abfahrt {
  initialDeparture: Date;
  arrival?: StopInfo;
  auslastung: boolean;
  currentStopPlace: MinimalStopPlace;
  departure?: StopInfo;
  destination: string;
  id: string;
  additional?: boolean;
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
  /**
   * Most likely has coach sequence
   */
  reihung: boolean;
  route: Stop[];
  scheduledDestination: string;
  scheduledPlatform: string;
  substitute?: boolean;
  train: TrainInfo;
}

export interface IrisMessage {
  text: string;
  timestamp?: Date;
  superseded?: boolean;
  priority?: MessagePrio;
  value: number;
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
  wingIds?: string[];
  cancelled?: boolean;
  hidden?: boolean;
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
  longDistance?: boolean;
  type: string;
  number: string;
}

export interface Wings {
  [name: string]: Abfahrt;
}
