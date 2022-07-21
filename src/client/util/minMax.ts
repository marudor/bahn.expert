type IdFn<T> = (item: T) => unknown;
type Identifier<T> = IdFn<T> | keyof T;

const getIdFn = <T>(identifier?: Identifier<T>) => {
  if (!identifier) return (id: T) => id;
  if (typeof identifier === 'function') return identifier;
  return (item: T) => item[identifier];
};

const minMax = <T>(
  array: T[],
  compareFn: <X>(a: X, b: X) => boolean,
  idFn: IdFn<T>,
): T | undefined => {
  if (!array.length) return undefined;
  let searched = array[0];
  for (let i = 1; i < array.length; i += 1) {
    if (compareFn(idFn(searched), idFn(array[i]))) searched = array[i];
  }
  return searched;
};

export const minBy = <T>(
  array: T[],
  identifier?: Identifier<T>,
): T | undefined => minMax(array, (a, b) => a > b, getIdFn(identifier));

export const maxBy = <T>(
  array: T[],
  identifier?: Identifier<T>,
): T | undefined => minMax(array, (a, b) => a < b, getIdFn(identifier));
