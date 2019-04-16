export enum AuslastungsValue {
  Green = 0,
  Yellow,
  Red,
}
export type AuslastungEntry = {
  time: string;
  start: string;
  stop: string;
  first: AuslastungsValue;
  second: AuslastungsValue;
};

export type AuslasungData = AuslastungEntry[];

export type Auslastung = {
  lastUpdate: string;
  data: AuslastungEntry[];
};
