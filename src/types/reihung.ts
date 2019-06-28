export type FahrzeugType = 'IC' | 'EC' | 'ICE' | 'TGV';

export type Meta = {
  id: string;
  owner: 'vz';
  format: 'JSON';
  version: string;
  created: string;
  sequence: number;
};

export type Fahrzeugausstattung = {
  anzahl: string;
  ausstattungsart: string;
  bezeichnung: string;
  status: string;
};

export type Position = {
  endemeter: string;
  endeprozent: string;
  startmeter: string;
  startprozent: string;
};

export type Fahrzeug = {
  allFahrzeugausstattung: Fahrzeugausstattung[];
  kategorie: string;
  fahrzeugnummer: string;
  orientierung: string;
  positioningruppe: string;
  fahrzeugsektor: string;
  fahrzeugtyp: string;
  wagenordnungsnummer: string;
  positionamhalt: Position;
  status: string;
};

export type Fahrzeuggruppe = {
  // custom
  startProzent: number;
  endeProzent: number;
  br?: BRInfo;
  // custom
  allFahrzeug: Fahrzeug[];
  fahrzeuggruppebezeichnung: string;
  zielbetriebsstellename: string;
  startbetriebsstellename: string;
  verkehrlichezugnummer: string;
};

export type Sektor = {
  positionamgleis: Position;
  sektorbezeichnung: string;
};

export type Halt = {
  // ISO String
  abfahrtszeit: string;
  // ISO String
  ankunftszeit: string;
  bahmhofsname: string;
  evanummer: string;
  gleisbezeichnung: string;
  haltid: string;
  rl100: string;
  allSektor: Sektor[];
};

export type Formation = {
  fahrtrichtung: 'VORWAERTS' | 'RUCKWAERTS';
  /* Custom */
  isActuallyIC: boolean;
  reportedZuggattung?: string;
  differentDestination: boolean;
  differentZugnummer: boolean;
  scale: number;
  startPercentage: number;
  endPercentage: number;
  // 1 = Vorwärts, 0 = Rückwärts
  realFahrtrichtung: boolean;
  /* End Custom */
  allFahrzeuggruppe: Fahrzeuggruppe[];
  halt: Halt;
  liniebezeichnung: string;
  zuggattung: FahrzeugType;
  zugnummer: string;
  serviceid: string;
  planstarttag: string;
  fahrtid: string;
  istplaninformation: boolean;
  br?: BRInfo;
};

export type Data = {
  istformation: Formation;
};

export type Wagenreihung = {
  meta: Meta;
  data: Data;
};

export type Reihung = Formation;

export interface DetailedBRInfo {
  comfort?: string[];
  quiet?: string[];
  toddler?: string[];
}
export interface BRInfo extends DetailedBRInfo {
  name: string;
  BR?: string;
  serie?: string;
  redesign?: boolean;
  noPdf?: boolean;
  pdf?: string;
  country?: 'DE' | 'AT';
  showBRInfo?: boolean;
}
