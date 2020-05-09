import {
  AbfahrtenConfig,
  AbfahrtenConfigSanitize,
  CheckInType,
  CommonConfig,
  CommonConfigSanitize,
} from 'client/Common/config';
import { StationSearchType } from 'types/station';

export const defaultAbfahrtenConfig: AbfahrtenConfig = {
  autoUpdate: 0,
  lineAndNumber: false,
  lookahead: '150',
  lookbehind: '0',
  searchType: StationSearchType.default,
  showSupersededMessages: false,
};

export const defaultCommonConfig: CommonConfig = {
  checkIn: CheckInType.None,
  time: true,
  zoomReihung: true,
  showUIC: false,
  fahrzeugGruppe: false,
};

const booleanCheck = (value: string): boolean => value === 'true';
const numberCheck = (value: string, fallback: number): number => {
  const n = +value;

  if (Number.isNaN(n)) return fallback;

  return n;
};
const searchTypeCheck = (value: string): StationSearchType =>
  Object.values(StationSearchType).includes(value as StationSearchType)
    ? (value as StationSearchType)
    : StationSearchType.default;
const checkInCheck = (
  value: string,
  numberVal = Number.parseInt(value, 10)
): CheckInType =>
  Object.values(CheckInType).includes(numberVal) ? numberVal : CheckInType.None;

export const abfahrtenConfigSanitize: AbfahrtenConfigSanitize = {
  autoUpdate: (value) => numberCheck(value, 0),
  lineAndNumber: booleanCheck,
  lookahead: (value) => numberCheck(value, 150).toString(),
  lookbehind: (value) => numberCheck(value, 0).toString(),
  searchType: searchTypeCheck,
  showSupersededMessages: booleanCheck,
};

export const commonConfigSanitize: CommonConfigSanitize = {
  checkIn: checkInCheck,
  time: booleanCheck,
  zoomReihung: booleanCheck,
  showUIC: booleanCheck,
  fahrzeugGruppe: booleanCheck,
};
