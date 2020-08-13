import {
  AbfahrtenConfigSanitize,
  CommonConfigSanitize,
} from 'client/Common/config';
import { StationSearchType } from 'types/station';

const booleanCheck = (value: string | undefined): boolean => value === 'true';
const numberCheck = (value: string | undefined, fallback: number): number => {
  if (!value) return fallback;
  const n = +value;

  if (Number.isNaN(n)) return fallback;

  return n;
};
const searchTypeCheck = (value: string | undefined): StationSearchType =>
  Object.values(StationSearchType).includes(value as StationSearchType)
    ? (value as StationSearchType)
    : StationSearchType.default;

export const abfahrtenConfigSanitize: AbfahrtenConfigSanitize = {
  autoUpdate: (value) => numberCheck(value, 0),
  lineAndNumber: booleanCheck,
  lookahead: (value) => numberCheck(value, 150).toString(),
  lookbehind: (value) => numberCheck(value, 0).toString(),
  searchType: searchTypeCheck,
};

export const commonConfigSanitize: CommonConfigSanitize = {
  time: booleanCheck,
  zoomReihung: booleanCheck,
  showUIC: booleanCheck,
  fahrzeugGruppe: booleanCheck,
};

export const orderBy = <T>(
  array: T[],
  identifier: keyof T,
  order: 'asc' | 'desc' = 'asc'
): T[] => {
  const sorted = [...array].sort((a, b) => {
    return a[identifier] > b[identifier]
      ? 1
      : a[identifier] === b[identifier]
      ? 0
      : -1;
  });

  return order === 'asc' ? sorted : sorted.reverse();
};

const minMax = <T>(
  array: T[],
  compareFn: <X>(a: X, b: X) => boolean,
  idFn: IdFn<T>
): T | undefined => {
  if (!array.length) return undefined;
  let searched = array[0];
  for (let i = 1; i < array.length; i += 1) {
    if (compareFn(idFn(searched), idFn(array[i]))) searched = array[i];
  }
  return searched;
};

type IdFn<T> = (item: T) => unknown;
type Identifier<T> = IdFn<T> | keyof T;

const getIdFn = <T>(identifier?: Identifier<T>) => {
  if (!identifier) return (id: T) => id;
  if (typeof identifier === 'function') return identifier;
  return (item: T) => item[identifier];
};

export const minBy = <T>(
  array: T[],
  identifier?: Identifier<T>
): T | undefined => minMax(array, (a, b) => a > b, getIdFn(identifier));

export const maxBy = <T>(
  array: T[],
  identifier?: Identifier<T>
): T | undefined => minMax(array, (a, b) => a < b, getIdFn(identifier));

export const uniqBy = <T>(array: T[], identifier: keyof T): T[] => {
  const seen: unknown[] = [];
  return array.filter((item) => {
    if (!seen.includes(item[identifier])) {
      seen.push(item[identifier]);
      return true;
    }
    return false;
  });
};
