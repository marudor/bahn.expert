namespace NodeJS {
  interface Global {
    PROD: boolean;
    SERVER: boolean;
  }
}

type Features = {
  'google-analytics': boolean;
  routing: boolean;
};

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
