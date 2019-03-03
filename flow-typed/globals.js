type marudorConfig = {|
  time: boolean,
  searchType:
    | 'dbNav'
    | 'opendata'
    | 'openDataOffline'
    | 'openDB'
    | 'hafas'
    | 'favOpenDb'
    | 'stationsData'
    | 'favendo'
    | '',
  traewelling: boolean,
  zoomReihung: boolean,
  showSupersededMessages: boolean,
  lookahead: string,
  fahrzeugGruppe: boolean,
  lineAndNumber: boolean,
|};

declare var PROD: boolean;
