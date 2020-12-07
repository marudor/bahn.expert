import type { CommonProductInfo, CommonStopInfo } from 'types/HAFAS';
import type { Station } from 'types/station';

export interface WingInfo<DateType = Date> {
  station: {
    id: string;
    title: string;
  };
  pt: DateType;
  fl: boolean;
}

export interface WingDefinition<DateType = Date> {
  start?: WingInfo<DateType>;
  end?: WingInfo<DateType>;
}

export interface AbfahrtenResult<DateType = Date> {
  departures: Abfahrt<DateType>[];
  lookbehind: Abfahrt<DateType>[];
  wings: Wings<DateType>;
}

export interface Abfahrt<DateType = Date> {
  initialDeparture: DateType;
  arrival?: StopInfo<DateType>;
  auslastung: boolean;
  currentStation: Station;
  departure?: StopInfo<DateType>;
  destination: string;
  id: string;
  additional?: boolean;
  cancelled?: boolean;
  mediumId: string;
  messages: Messages<DateType>;
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
  /**
   * Most likely does not have coach sequence
   */
  hiddenReihung?: boolean;
}

export interface IrisMessage<DateType = Date> {
  text: string;
  timestamp?: DateType;
  superseded?: boolean;
  priority?: MessagePrio;
}

export interface HimIrisMessage<DateType = Date> extends IrisMessage<DateType> {
  head: string;
}

export type Message<DateType = Date> =
  | IrisMessage<DateType>
  | HimIrisMessage<DateType>;

/**
 * 1: High; 2: Medium; 3: Low; 4: Done
 */

export type MessagePrio = '1' | '2' | '3' | '4';
export interface Messages<DateType = Date> {
  [name: string]: Message<DateType>[];
  qos: IrisMessage<DateType>[];
  delay: IrisMessage<DateType>[];
  him: HimIrisMessage<DateType>[];
}

export interface StopInfo<DateType = Date> extends CommonStopInfo<DateType> {
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

export interface Wings<DateType = Date> {
  [name: string]: Abfahrt<DateType>;
}
