import type {
  AbfahrtenConfigSanitize,
  CommonConfigSanitize,
} from 'client/Common/config';

const booleanCheck = (value: string | string[] | undefined): boolean =>
  value === 'true';
const numberCheck = (
  value: string | string[] | undefined,
  fallback: number,
): number => {
  if (!value) return fallback;
  const n = +value;

  if (Number.isNaN(n)) return fallback;

  return n;
};

export const abfahrtenConfigSanitize: AbfahrtenConfigSanitize = {
  lineAndNumber: booleanCheck,
  lookahead: (value) => numberCheck(value, 150).toString(),
  lookbehind: (value) => numberCheck(value, 0).toString(),
  showCancelled: booleanCheck,
  sortByTime: booleanCheck,
  onlyDepartures: booleanCheck,
};

export const commonConfigSanitize: CommonConfigSanitize = {
  autoUpdate: (value) => numberCheck(value, 0),
  hideTravelynx: booleanCheck,
  showUIC: booleanCheck,
  fahrzeugGruppe: booleanCheck,
  time: booleanCheck,
  showCoachType: booleanCheck,
};
