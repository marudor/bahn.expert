type marudorConfig = {|
  +time: boolean,
  +searchType:
    | 'dbNav'
    | 'opendata'
    | 'openDataOffline'
    | 'openDB'
    | 'hafas'
    | 'favOpenDb'
    | 'stationsData'
    | 'favendo'
    | '',
  +checkIn: 'traewelling' | 'travelynx' | '',
  +zoomReihung: boolean,
  +showSupersededMessages: boolean,
  +lookahead: string,
  +fahrzeugGruppe: boolean,
  +lineAndNumber: boolean,
|};

type FeatureKeys = 'google-analytics';

declare var PROD: boolean;
declare var SERVER: boolean;
