export interface WagenreihungStation {
  trainNumber: string;
  trainType?: any;
  time?: any;
  timeOffset?: any;
  weekday?: any;
  platform?: any;
  waggon?: any;
  trainLine?: any;
  stations: SpecificWagenreihung[];
}

export interface SpecificWagenreihung {
  name: string;
  additionalId: AdditionalId;
  trackRecords: TrackRecord[];
}

export interface AdditionalId {
  evaNr: string;
  shortName: string;
}

export interface TrackRecord {
  time: string;
  additionalText: string;
  name: string;
  trainNumbers: string[];
  days: any[];
  subtrains: Subtrain[];
  waggons: Waggon[];
  trainTpes?: string;
}

export interface Subtrain {
  destination: Destination;
  sections: string[];
}

export interface Destination {
  destinationName: string;
  destinationVia: string[];
}

export interface Waggon {
  position: number;
  waggon: boolean;
  sections: string[];
  number: string;
  type: '2' | '1' | 's' | 'e';
  symbols: string;
  differentDestination: string;
  length: number;
}

export interface Formation {
  fahrtrichtung: 'VORWAERTS' | 'RUCKWAERTS';
  isActuallyIC: boolean;
  reportedZuggattung?: string;
  differentDestination: boolean;
  differentZugnummer: boolean;
  scale: number;
  startPercentage: number;
  endPercentage: number;
  /**
   * true = Vorwärts
   */

  realFahrtrichtung: boolean;
  allFahrzeuggruppe: Fahrzeuggruppe[];
  halt: Halt;
  liniebezeichung: string;
  zuggattung: string;
  zugnummer: string;
  serviceid: string;
  planstarttag: string;
  fahrtid: string;
  istplaninformation: boolean;
  br?: BRInfo;
}

export interface Fahrzeuggruppe {
  startPercentage: number;
  endPercentage: number;
  br?: BRInfo;
  allFahrzeug: Fahrzeug[];
  fahrzeuggruppebezeichnung: string;
  zielbetriebsstellename: string;
  startbetriebsstellename: string;
  verkehrlichezugnummer: string;
}

export interface Halt {
  abfahrtszeit?: string; // date-time

  ankunftszeit?: string; // date-time

  bahnhofsname: string;
  evanummer: string;
  gleisbezeichnung?: string;
  haltid: string;
  rl100: string;
  allSektor: Sektor[];
}

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

export interface Fahrzeug {
  additionalInfo: AdditionalFahrzeugInfo;
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
}
export interface Position {
  endemeter: string;
  endeprozent: string;
  startmeter: string;
  startprozent: string;
}

export interface Sektor {
  positionamgleis: Position;
  sektorbezeichnung: string;
}

export interface AdditionalFahrzeugInfo {
  /**
   * 0: Unknown; 1: erste; 2: zweite; 3: 1&2; 4: Nicht für Passagiere
   */
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
}

export interface Fahrzeugausstattung {
  anzahl: string;
  ausstattungsart: string;
  bezeichnung: string;
  status: string;
}

export interface Wagenreihung {
  meta: Meta;
  data: Data;
}

export interface Meta {
  id: string;
  owner: string;
  format: 'JSON';
  version: string;
  created: string;
  sequence: number;
}

export interface Data {
  istformation: Formation;
}
