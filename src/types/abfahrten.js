// @flow
export type SubstituteRef = {|
  +trainNumber: string,
  +trainType: string,
  +train: string,
|};

export type Message$Priority =
  | '1' // HIGH
  | '2' // MEDIUM
  | '3' // LOW
  | '4'; // DONE
export type Message = {|
  +text: string,
  +timestamp: number,
  +superseded?: boolean,
  +superseeds?: boolean,
  +priority?: Message$Priority,
|};

export type Train = {|
  +isAdditional?: boolean,
  +isCancelled?: boolean,
  +name: string,
|};

export type Messages = {|
  +qos: Message[],
  +delay: Message[],
  +[string]: Message[],
|};

export type Abfahrt = {|
  +arrival?: number,
  +arrivalIsCancelled: boolean,
  +arrivalWingIds: ?(string[]),
  +auslastung: boolean,
  +currentStation: string,
  +currentStationEva: string,
  +delayArrival?: number,
  +delayDeparture?: number,
  +departure?: number,
  +departureIsCancelled: boolean,
  +departureWingIds: ?(string[]),
  +destination: string,
  +hiddenArrival?: number,
  +hiddenDeparture?: number,
  +id: string,
  +isCancelled: boolean,
  +longDistance: boolean,
  +mediumId: string,
  +messages: Messages,
  +platform: string,
  +productClass: 'D' | 'N' | 'S' | 'F',
  +rawId: string,
  +ref?: SubstituteRef,
  +reihung: boolean,
  +route: Train[],
  +scheduledArrival?: number,
  +scheduledDeparture?: number,
  +scheduledDestination: string,
  +scheduledPlatform: string,
  +substitute: boolean,
  +thirdParty?: string,
  +train: string,
  +trainId: string,
  +trainNumber: string,
  +trainType: string,
  +via: string[],
|};

export type Wings = {
  +[mediumId: string]: Abfahrt,
};

export type ResolvedWings = {|
  +arrivalWings: ?(Abfahrt[]),
  +departureWings: ?(Abfahrt[]),
|};

export type AbfahrtAPIResult = {|
  +departures: Abfahrt[],
  +wings: Wings,
  +lageplan?: ?string,
|};

export type WingNode = {|
  +station: {|
    +id: string,
    +title: string,
  |},
  +pt: number,
  +fl: boolean,
|};

export default {};
