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

type CheckInType = 'traewelling' | 'travelynx' | '';

type marudorConfig = {|
  +time: boolean,
  +searchType: StationSearchType,
  +checkIn: CheckInType,
  +zoomReihung: boolean,
  +showSupersededMessages: boolean,
  +lookahead: string,
  +fahrzeugGruppe: boolean,
  +lineAndNumber: boolean,
  +autoUpdate: number,
  +onlyDepartures: boolean,
|};

type marudorConfigSanitize = $ObjMap<marudorConfig, <V>(V) => string => V>;

type Features = {|
  +'google-analytics': boolean,
  +routing: boolean,
|};

type FeatureKeys = $Keys<Features>;

declare var PROD: boolean;
declare var SERVER: boolean;

type DispatchAction = *;
type Dispatch<A: DispatchAction> = A => A;
