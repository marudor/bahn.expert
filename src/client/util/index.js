// @flow
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

export const defaultConfig = {
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
// $FlowFixMe - flow doesn't understand includes
const searchTypeCheck = (value: string): StationSearchType =>
  validSearchTypes.includes(value) ? value : '';
// $FlowFixMe - flow doesn't understand includes
const checkInCheck = (value: string): CheckInType =>
  validCheckIn.includes(value) ? value : '';

export const configSanitize: marudorConfigSanitize = {
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
