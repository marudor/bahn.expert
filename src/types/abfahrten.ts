import { CommonStopInfo } from './api/common';
import { Messages, SubstituteRef, Train, TrainInfo } from 'types/api/iris';
import { Station } from './station';

export interface StopInfo extends CommonStopInfo {
  wingIds?: null | string[];
  cancelled: boolean;
  hidden: boolean;
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
  productClass: string; // 'D' | 'N' | 'S' | 'F';
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
