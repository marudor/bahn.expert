import { CommonProductInfo } from './common';
import { CommonStopInfo } from './common';
import { Station } from './station';
export interface Abfahrt {
  initialDeparture: number;
  arrival?: StopInfo;
  auslastung: boolean;
  currentStation: Station;
  departure?: StopInfo;
  destination: string;
  id: string;
  additional?: boolean;
  cancelled: boolean;
  mediumId: string;
  messages: Messages;
  platform: string;
  /**
   * Most likely D | N | S | F
   */

  productClass: string;
  rawId: string;
  ref?: SubstituteRef;
  reihung: boolean;
  route: Train[];
  scheduledDestination: string;
  scheduledPlatform: string;
  substitue: boolean;
  train: TrainInfo;
  hiddenReihung: boolean;
}
export interface AbfahrtenResponse {
  lageplan?: string | null;
  wings: Wings;
  /**
   * Liste an Abfahrten (Zukunft)
   */

  departures: Abfahrt[];
  /**
   * Liste an Abfahrten (Vergangenheit)
   */

  lookbehind: Abfahrt[];
}
/**
 */

export interface Message {
  text: string;
  timestamp: number;
  superseded?: boolean;
  priority?: MessagePrio;
}
export type MessageArray = Message[];
/**
 * 1: High; 2: Medium; 3: Low; 4: Done
 */

export type MessagePrio = '1' | '2' | '3' | '4';
export interface Messages {
  [name: string]: MessageArray;
  qos: MessageArray;
  delay: MessageArray;
}
/**
 */

/**
 */

export type StopInfo = CommonStopInfo & {
  wingIds?: string[] | null;
  cancelled: boolean;
  hidden: boolean;
};
export interface SubstituteRef {
  trainNumber: string;
  trainType: string;
  train: string;
}
export interface Train {
  additional?: boolean;
  cancelled?: boolean;
  showVia?: boolean;
  name: string;
}
/**
 */

export type TrainInfo = CommonProductInfo & {
  thirdParty?: string;
  longDistance: boolean;
  type: string;
  trainCategory: string;
  number: string;
};
export interface WingInfo {
  station: {
    id: string;
    title: string;
  };
  pt: number;
  fl: boolean;
}
export type WingResponse = WingSuccessResponse | {};
export interface WingSuccessResponse {
  start: WingInfo;
  end: WingInfo;
}
/**
 * Key = mediumId of Abfahrt
 */

export interface Wings {
  [name: string]: Abfahrt;
}
