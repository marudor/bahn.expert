// @flow
export type Meta = {
  id: string,
  owner: 'vz',
  format: 'JSON',
  version: string,
  created: string,
  sequence: number,
};

export type Fahrzeugausstattung = {
  anzahl: string,
  ausstattungsart: string,
  bezeichnung: string,
  status: string,
};

export type Position = {
  endemeter: string,
  endeprozent: string,
  startmeter: string,
  startprozent: string,
};

export type Fahrzeug = {
  allFahrzeugausstattung: Fahrzeugausstattung[],
  kategorie: string,
  fahrzeugnummer: string,
  orientierung: string,
  positioningruppe: string,
  fahrzeugsektor: string,
  fahrzeugtyp: string,
  wagenordnungsnummer: string,
  positionamhalt: Position,
  status: string,
};

export type Fahrzeuggruppe = {
  allFahrzeug: Fahrzeug[],
  fahrzeuggruppebezeichnung: string,
  zielbetriebsstellename: string,
  startbetriebsstellename: string,
  verkehrlichezugnummer: string,
};

export type Sektor = {
  positionamgleis: Position,
  sektorbezeichnung: string,
};

export type Halt = {
  // ISO String
  abfahrtszeit: string,
  // ISO String
  ankunftszeit: string,
  bahmhofsname: string,
  evanummer: string,
  gleisbezeichnung: string,
  haltid: string,
  rl100: string,
  allSektor: Sektor[],
};

export type Formation = {
  fahrtrichtung: 'VORWAERTS' | 'RUCKWAERTS',
  /* Custom */
  reverseRichtung: boolean,
  differentDestination: boolean,
  /* End Custom */
  allFahrzeuggruppe: Fahrzeuggruppe[],
  halt: Halt,
  liniebezeichnung: string,
  zuggattung: string,
  zugnummer: string,
  serviceid: string,
  planstarttag: string,
  fahrtid: string,
  istplaninformation: boolean,
};

export type Data = {
  istformation: Formation,
};

export type Wagenreihung = {
  meta: Meta,
  data: Data,
};

export type Reihung = Formation;

export default {};
