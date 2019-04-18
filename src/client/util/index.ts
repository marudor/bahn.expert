import {
  CheckInType,
  MarudorConfig,
  MarudorConfigSanitize,
  StationSearchType,
} from 'Common/config';

export const setCookieOptions = {
  expires: new Date('2037-12-12'),
  httpOnly: false,
};

export const defaultConfig: MarudorConfig = {
  autoUpdate: 0,
  checkIn: CheckInType.None,
  fahrzeugGruppe: false,
  lineAndNumber: false,
  lookahead: '150',
  lookbehind: '0',
  onlyDepartures: false,
  searchType: StationSearchType.Default,
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
  // @ts-ignore this works
  StationSearchType[StationSearchType[Number.parseInt(value, 10)]] ||
  StationSearchType.Default;
const checkInCheck = (value: string): CheckInType =>
  // @ts-ignore this works
  CheckInType[CheckInType[Number.parseInt(value, 10)]] || CheckInType.None;

export const configSanitize: MarudorConfigSanitize = {
  autoUpdate: value => numberCheck(value, 0),
  checkIn: checkInCheck,
  fahrzeugGruppe: booleanCheck,
  lineAndNumber: booleanCheck,
  lookahead: value => numberCheck(value, 150).toString(),
  lookbehind: value => numberCheck(value, 0).toString(),
  onlyDepartures: booleanCheck,
  searchType: searchTypeCheck,
  showSupersededMessages: booleanCheck,
  time: booleanCheck,
  zoomReihung: booleanCheck,
};
