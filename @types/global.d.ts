namespace NodeJS {
  interface Global {
    PROD: boolean;
    SERVER: boolean;
    smallScreen: boolean;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: Function;
    __DATA__: Object;
  }
}

type Features = {
  'google-analytics': boolean;
  routing: boolean;
};

type CheckInType = 'traewelling' | 'travelynx' | 'traewelynx' | '';

type StationSearchType =
  | 'dbNav'
  | 'openData'
  | 'openDataOffline'
  | 'openDB'
  | 'hafas'
  | 'favOpenDB'
  | 'stationsData'
  | 'favendo'
  | '';

type MarudorConfig = {
  readonly time: boolean;
  readonly searchType: StationSearchType;
  readonly checkIn: CheckInType;
  readonly zoomReihung: boolean;
  readonly showSupersededMessages: boolean;
  readonly lookahead: string;
  readonly fahrzeugGruppe: boolean;
  readonly lineAndNumber: boolean;
  readonly autoUpdate: number;
  readonly onlyDepartures: boolean;
};

type MarudorConfigSanitize = {
  [K in keyof MarudorConfig]: (input: string) => MarudorConfig[K]
};
