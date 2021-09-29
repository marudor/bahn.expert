export interface BaseFormation {
  /**
   * Should always be VORWAERTS
   */
  fahrtrichtung: 'VORWAERTS' | 'RUCKWAERTS';
  allFahrzeuggruppe: BaseFahrzeuggruppe[];
  halt: Halt;
  liniebezeichnung: string;
  zuggattung: string;
  zugnummer: string;
  /**
   * ???
   */
  serviceid: string;
  planstarttag: string;
  /**
   * ???
   */
  fahrtid: string;
  istplaninformation: boolean;
}

export interface Formation extends BaseFormation {
  allFahrzeuggruppe: Fahrzeuggruppe[];
  /**
   * Train is reported as ICE but has IC coach sequence
   */
  isActuallyIC: boolean;
  /**
   * Train Category that was reported
   */
  reportedZuggattung: string;
  /**
   * do groups have a different destination
   */
  differentDestination?: boolean;
  /**
   * Do we have several trains in one? (Flügelung)
   */
  differentZugnummer?: boolean;
  scale: number;
  startPercentage: number;
  endPercentage: number;
  /**
   * true = Vorwärts
   */
  realFahrtrichtung: boolean;
  isRealtime: boolean;
}

export interface BaseFahrzeuggruppe {
  allFahrzeug: BaseFahrzeug[];
  fahrzeuggruppebezeichnung: string;
  zielbetriebsstellename: string;
  startbetriebsstellename: string;
  verkehrlichezugnummer: string;
}

export interface Fahrzeuggruppe extends BaseFahrzeuggruppe {
  goesToFrance: boolean;
  allFahrzeug: Fahrzeug[];
  startPercentage: number;
  endPercentage: number;
  /**
   * 0169 for instance, from Gruppenbezeichnung
   */
  tzn?: string;
  /**
   * Worms for instance
   */
  name?: string;
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

export type AvailableBR =
  | '401'
  | '402'
  | '403'
  | '406'
  | '407'
  | '410.1'
  | '411'
  | '412'
  | '415';

export type AvailableIdentifier =
  | AvailableBR
  | '401.LDV'
  | '401.9'
  | '411.S1'
  | '411.S2'
  | '412.7'
  | '412.13'
  | '403.R'
  | '403.S1'
  | '403.S2'
  | '406.R'
  | 'IC2.TWIN'
  | 'IC2.KISS'
  | 'MET'
  | 'TGV';

export interface BRInfo {
  name: string;
  BR?: AvailableBR;
  identifier?: AvailableIdentifier;
  noPdf?: boolean;
  country?: 'DE' | 'AT';
  showBRInfo?: boolean;
}

export type FahrzeugKategorie =
  | 'DOPPELSTOCKSTEUERWAGENERSTEZWEITEKLASSE'
  | 'DOPPELSTOCKSTEUERWAGENZWEITEKLASSE'
  | 'DOPPELSTOCKWAGENERSTEKLASSE'
  | 'DOPPELSTOCKWAGENERSTEZWEITEKLASSE'
  | 'DOPPELSTOCKWAGENZWEITEKLASSE'
  | 'HALBSPEISEWAGENERSTEKLASSE'
  | 'HALBSPEISEWAGENZWEITEKLASSE'
  | 'LOK'
  | 'REISEZUGWAGENERSTEKLASSE'
  | 'REISEZUGWAGENERSTEZWEITEKLASSE'
  | 'REISEZUGWAGENZWEITEKLASSE'
  | 'SPEISEWAGEN'
  | 'STEUERWAGENERSTEKLASSE'
  | 'STEUERWAGENERSTEZWEITEKLASSE'
  | 'STEUERWAGENZWEITEKLASSE'
  | 'TRIEBKOPF'
  | 'OEBB';

export interface BaseFahrzeug {
  allFahrzeugausstattung: Fahrzeugausstattung[];
  kategorie: FahrzeugKategorie;
  fahrzeugnummer: string;
  orientierung: string;
  positioningruppe: string;
  fahrzeugsektor: string;
  fahrzeugtyp: string;
  wagenordnungsnummer: string;
  positionamhalt: Position;
  status: string;
}

export interface Fahrzeug extends BaseFahrzeug {
  additionalInfo: AdditionalFahrzeugInfo;
}
/**
 * @tsoaModel
 */
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

export interface SpecialSeats {
  comfort?: number[];
  express?: number[];
  disabled?: number[];
}

export interface AdditionalFahrzeugInfo {
  /**
   * 0: Unknown; 1: erste; 2: zweite; 3: 1&2; 4: Not for passengers
   */
  klasse: 0 | 1 | 2 | 3 | 4;
  icons: {
    dining?: boolean;
    wheelchair?: boolean;
    bike?: boolean;
    disabled?: boolean;
    quiet?: boolean;
    info?: boolean;
    family?: boolean;
    toddler?: boolean;
    wifi?: boolean;
  };
  comfort?: boolean;
  comfortSeats?: string;
  disabledSeats?: string;
  familySeats?: string;
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
  istformation: BaseFormation;
}
