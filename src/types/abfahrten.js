// @flow
export type SubstituteRef = {|
  trainNumber: string,
  trainType: string,
  train: string,
|};
export type Station = {|
  title: string,
  id: string | number,
  favendoId?: number,
  DS100?: string,
|};

export type Message = {|
  text: string,
  timestamp: string,
  superseded?: boolean,
  superseeds?: boolean,
|};

export type Train = {|
  isAdditional?: 0 | 1,
  isCancelled?: 0 | 1,
  name: string,
|};

export type Messages = {|
  qos: Message[],
  delay: Message[],
|};
export type Abfahrt = {|
  arrivalWingIds: ?(string[]),
  auslastung: boolean,
  currentStation: string,
  delayArrival?: number,
  delayDeparture?: number,
  departureWingIds: ?(string[]),
  destination: string,
  id: string,
  isCancelled: 0 | 1,
  longDistance: boolean,
  mediumId: string,
  messages: Messages,
  platform: string,
  rawId: string,
  ref?: SubstituteRef,
  reihung: boolean,
  route: Train[],
  scheduledArrival?: string,
  scheduledDeparture?: string,
  scheduledDestination: string,
  scheduledPlatform: string,
  substitute: boolean,
  train: string,
  trainId: string,
  trainNumber: string,
  trainType: string,
  via: string[],
|};

export type Wings = {
  [mediumId: string]: Abfahrt,
};

export type ResolvedWings = {|
  arrivalWings: ?(Abfahrt[]),
  departureWings: ?(Abfahrt[]),
|};

export type AbfahrtAPIResult = {|
  departures: Abfahrt[],
  wings: Wings,
|};

export default {};
