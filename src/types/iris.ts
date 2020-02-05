import { CommonProductInfo, CommonStopInfo } from 'types/HAFAS';
import { Station } from 'types/station';

export interface WingInfo {
  station: {
    id: string;
    title: string;
  };
  pt: number;
  fl: boolean;
}

export interface WingDefinition {
  start?: WingInfo;
  end?: WingInfo;
}

export interface AbfahrtenResult {
  departures: Abfahrt[];
  lookbehind: Abfahrt[];
  wings: Wings;
}

export interface Abfahrt {
  /**
   * Unix Time (ms)
   */
  initialDeparture: number;
  arrival?: StopInfo;
  auslastung: boolean;
  currentStation: Station;
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
  route: Train[];
  scheduledDestination: string;
  scheduledPlatform: string;
  substitute?: boolean;
  train: TrainInfo;
  /**
   * Most likely does not have coach sequence
   */
  hiddenReihung?: boolean;
}

export interface IrisMessage {
  text: string;
  timestamp: number;
  superseded?: boolean;
  priority?: MessagePrio;
}

export interface HimIrisMessage extends IrisMessage {
  head: string;
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

export interface Train {
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
