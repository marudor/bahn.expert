// @flow
export type AuslastungEntry = {|
  +time: string,
  +start: string,
  +stop: string,
  +first: 0 | 1 | 2,
  +second: 0 | 1 | 2,
|};

export type AuslasungData = AuslastungEntry[];

export type Auslastung = {|
  +lastUpdate: string,
  +data: AuslastungEntry[],
|};

export default {};
