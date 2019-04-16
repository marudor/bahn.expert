export const setCookieOptions = {
  expires: new Date('2037-12-12'),
  httpOnly: false,
};

export const validSearchTypes: StationSearchType[] = [
  'dbNav',
  'openData',
  'openDataOffline',
  'openDB',
  'hafas',
  'favOpenDB',
  'stationsData',
  'favendo',
  '',
];

export const validCheckIn: CheckInType[] = ['traewelling', 'travelynx', ''];

export const defaultConfig: MarudorConfig = {
  autoUpdate: 0,
  checkIn: '',
  fahrzeugGruppe: false,
  lineAndNumber: false,
  lookahead: '150',
  onlyDepartures: false,
  searchType: '',
  showSupersededMessages: false,
  time: true,
  zoomReihung: true,
};

const booleanCheck = (value: string): boolean => value === 'true';
const numberCheck = (value: string, fallback: number): number => {
  const n = +value;

  if (Number.isNaN(n)) return fallback;

  return n;
};
const searchTypeCheck = (value: string): StationSearchType =>
  // @ts-ignore typescript doesn't understand includes
  validSearchTypes.includes(value) ? value : '';
const checkInCheck = (value: string): CheckInType =>
  // @ts-ignore typescript doesn't understand includes
  validCheckIn.includes(value) ? value : '';

export const configSanitize: MarudorConfigSanitize = {
  autoUpdate: value => numberCheck(value, 0),
  checkIn: checkInCheck,
  fahrzeugGruppe: booleanCheck,
  lineAndNumber: booleanCheck,
  lookahead: value => numberCheck(value, 150).toString(),
  onlyDepartures: booleanCheck,
  searchType: searchTypeCheck,
  showSupersededMessages: booleanCheck,
  time: booleanCheck,
  zoomReihung: booleanCheck,
};
