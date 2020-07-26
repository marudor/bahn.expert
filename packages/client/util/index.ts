import {
  AbfahrtenConfigSanitize,
  CommonConfigSanitize,
} from 'client/Common/config';
import { StationSearchType } from 'types/station';

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

export const abfahrtenConfigSanitize: AbfahrtenConfigSanitize = {
  autoUpdate: (value) => numberCheck(value, 0),
  lineAndNumber: booleanCheck,
  lookahead: (value) => numberCheck(value, 150).toString(),
  lookbehind: (value) => numberCheck(value, 0).toString(),
  searchType: searchTypeCheck,
  showSupersededMessages: booleanCheck,
};

export const commonConfigSanitize: CommonConfigSanitize = {
  time: booleanCheck,
  zoomReihung: booleanCheck,
  showUIC: booleanCheck,
  fahrzeugGruppe: booleanCheck,
};
