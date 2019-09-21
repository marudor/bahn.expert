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
/**
 * ICE, IC usw.
 */
export type FahrzeugType = string;
export interface Fahrzeugausstattung {
  anzahl: string;
  ausstattungsart: string;
  bezeichnung: string;
  status: string;
}
export interface Fahrzeuggruppe {
  startProzent: number;
  endeProzent: number;
  br?: BRInfo;
  allFahrzeug: Fahrzeug[];
  fahrzeuggruppebezeichnung: string;
  zielbetriebsstellename: string;
  startbetriebsstellename: string;
  verkehrlichezugnummer: string;
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
  zuggattung: FahrzeugType;
  zugnummer: string;
  serviceid: string;
  planstarttag: string;
  fahrtid: string;
  istplaninformation: boolean;
  br?: BRInfo;
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
