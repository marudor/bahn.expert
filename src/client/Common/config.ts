export enum CheckInType {
  None,
  Traewelling,
  Travelynx,
  Both,
}
export enum StationSearchType {
  Default,
  Favendo,
  DBNavgiator,
  OpenData,
  OpenDataOffline,
  /**
   * OpenDB Down
   */
  OpenDB,
  HAFAS,
  /**
   * OpenDB Down
   */
  FavendoAndOpenDB,
  StationsData,
  FavendoStationsData,
}

export type MarudorConfig = {
  readonly time: boolean;
  readonly searchType: StationSearchType;
  readonly checkIn: CheckInType;
  readonly zoomReihung: boolean;
  readonly showSupersededMessages: boolean;
  readonly lookahead: string;
  readonly lookbehind: string;
  readonly fahrzeugGruppe: boolean;
  readonly lineAndNumber: boolean;
  readonly autoUpdate: number;
  readonly noHeader: boolean;
};

export type MarudorConfigSanitize = {
  [K in keyof MarudorConfig]: (input: string) => MarudorConfig[K];
};
