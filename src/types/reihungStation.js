// @flow
/* Type
  2 - 2. Klasse
  1 - 1. Klasse
  e - ???
  s - ???
*/

/* symbols
  h - ???
  e - ???
  k - ???
  n - ???
  o - ???
  C - ???
  A - ???
*/
type Waggon = {
  position: number,
  waggon: boolean,
  sections: string[],
  number: string,
  type: '2' | '1' | 's' | 'e',
  symbols: string,
  differentDestination: string,
  length: number,
};

type Destination = {
  destinationName: string,
  destinationVia: string[],
};

type Subtrain = {
  destination: Destination,
  sections: string[],
};

type TrackRecord = {
  time: string,
  additionalText: string,
  name: string,
  trainNumbers: string[],
  days: any[],
  subtrains: Subtrain[],
  waggons: Waggon[],
  traintypes: string,
};

type SpecificWagenreihung = {
  name: string,
  additionalId: {
    evaNr: string,
    shortName: string,
  },
  trackRecords: TrackRecord[],
};

export type WagenreihungStation = {
  trainNubmer: string,
  trainType: ?any,
  time: ?any,
  timeOffset: ?any,
  weekday: ?any,
  platform: ?any,
  waggon: ?any,
  trainId: ?any,
  stations: SpecificWagenreihung[],
};
