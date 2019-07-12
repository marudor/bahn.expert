import { CommonProductInfo, CommonStopInfo } from './common';
import { Station } from './station';

// import { ParsedCommonArrival } from './common';

export type SubstituteRef = {
  trainNumber: string;
  trainType: string;
  train: string;
};

export type Message$Priority =
  | '1' // HIGH
  | '2' // MEDIUM
  | '3' // LOW
  | '4'; // DONE
export type Message = {
  text: string;
  timestamp: number;
  superseded?: boolean;
  priority?: Message$Priority;
};

export type Train = {
  additional?: boolean;
  cancelled?: boolean;
  showVia?: boolean;
  name: string;
};

export type Messages = {
  qos: Message[];
  delay: Message[];
  [key: string]: Message[];
};

export interface StopInfo extends CommonStopInfo {
  wingIds: null | string[];
  cancelled: boolean;
  hidden: boolean;
}

export interface TrainInfo extends CommonProductInfo {
  thirdParty?: string;
  longDistance: boolean;
  type: string;
  line: string;
  number: string;
}

export type Abfahrt = {
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
  productClass: 'D' | 'N' | 'S' | 'F';
  rawId: string;
  ref?: SubstituteRef;
  reihung: boolean;
  route: Train[];
  scheduledDestination: string;
  scheduledPlatform: string;
  substitute: boolean;
  train: TrainInfo;
  hiddenReihung: boolean;
};

export type Departures = {
  lookahead: Abfahrt[];
  lookbehind: Abfahrt[];
};

export type Wings = {
  [mediumId: string]: Abfahrt;
};

export type ResolvedWings = {
  arrivalWings?: Abfahrt[];
  departureWings?: Abfahrt[];
};

export type AbfahrtAPIResult = {
  departures: Abfahrt[];
  lookbehind: Abfahrt[];
  wings: Wings;
  lageplan?: null | string;
};

export type WingNode = {
  station: {
    id: string;
    title: string;
  };
  pt: number;
  fl: boolean;
};
