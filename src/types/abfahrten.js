// @flow
export type SubstituteRef = {|
  +trainNumber: string,
  +trainType: string,
  +train: string,
|};
export type Station = {|
  +title: string,
  +id: string,
  +favendoId?: number,
  +DS100?: string,
  +raw?: Object,
|};

export type Message = {|
  +text: string,
  +timestamp: number,
  +superseded?: boolean,
  +superseeds?: boolean,
|};

export type Train = {|
  +isAdditional?: 0 | 1,
  +isCancelled?: 0 | 1,
  +name: string,
|};

export type Messages = {|
  +qos: Message[],
  +delay: Message[],
|};
export type Abfahrt = {|
  +arrival?: number,
  +arrivalIsCancelled: boolean,
  +arrivalWingIds: ?(string[]),
  +auslastung: boolean,
  +currentStation: string,
  +currentStationEva: string,
  +delayArrival: number,
  +delayDeparture: number,
  +departure?: number,
  +departureIsCancelled: boolean,
  +departureWingIds: ?(string[]),
  +destination: string,
  +id: string,
  +isCancelled: 0 | 1,
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
