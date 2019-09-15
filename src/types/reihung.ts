export type FahrzeugType = 'IC' | 'EC' | 'ICE' | 'TGV';

export type Meta = {
  id: string;
  owner: 'vz';
  format: 'JSON';
  version: string;
  created: string;
  sequence: number;
};

// Klasse: 0 = unknown
// Klasse: 1 = Nur erste
// Klasse: 2 = Nur zweite
// Klasse: 3 = 1 & 2
// klasse: 4 = Nicht für Passagiere. z.B. Triebkopf
export type AdditionalFahrzeugInfo = {
  klasse: 0 | 1 | 2 | 3 | 4;
  speise?: boolean;
  rollstuhl?: boolean;
  fahrrad?: boolean;
  comfort?: boolean;
  schwebe?: boolean;
  ruhe?: boolean;
  info?: boolean;
  familie?: boolean;
  kleinkind?: boolean;
  wifi?: boolean;
  wifiOff?: boolean;
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
  additionalInfo: AdditionalFahrzeugInfo;
  // ap?: AP;
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

export interface BRInfo {
  name: string;
  BR?: string;
  serie?: string;
  redesign?: boolean;
  noPdf?: boolean;
  pdf?: string;
  country?: 'DE' | 'AT';
  showBRInfo?: boolean;
}
