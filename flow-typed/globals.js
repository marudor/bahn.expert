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

type marudorConfig = {|
  +time: boolean,
  +searchType: StationSearchType,
  +checkIn: 'traewelling' | 'travelynx' | '',
  +zoomReihung: boolean,
  +showSupersededMessages: boolean,
  +lookahead: string,
  +fahrzeugGruppe: boolean,
  +lineAndNumber: boolean,
  +autoUpdate: number,
|};

type Features = {|
  +'google-analytics': boolean,
  +routing: boolean,
|};

type FeatureKeys = $Keys<Features>;

declare var PROD: boolean;
declare var SERVER: boolean;
