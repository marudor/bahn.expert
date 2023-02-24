import type {
  AbfahrtenConfigSanitize,
  CommonConfigSanitize,
} from '@/client/Common/config';

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

const dateCheck = (value: string | string[] | undefined): Date | undefined => {
  if (typeof value !== 'string') {
    return undefined;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }
  return date;
};

export const abfahrtenConfigSanitize: AbfahrtenConfigSanitize = {
  lineAndNumber: booleanCheck,
  lookahead: (value) => numberCheck(value, 150).toString(),
  lookbehind: (value) => numberCheck(value, 0).toString(),
  showCancelled: booleanCheck,
  sortByTime: booleanCheck,
  onlyDepartures: booleanCheck,
  startTime: dateCheck,
};

export const commonConfigSanitize: CommonConfigSanitize = {
  autoUpdate: (value) => numberCheck(value, 0),
  hideTravelynx: booleanCheck,
  showUIC: booleanCheck,
  fahrzeugGruppe: booleanCheck,
  showCoachType: booleanCheck,
  delayTime: booleanCheck,
};
