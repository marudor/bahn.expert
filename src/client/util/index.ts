export * from './minMax';
export * from './configSanitize';

export const orderBy = <T>(
  array: T[],
  identifier: keyof T,
  order: 'asc' | 'desc' = 'asc',
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

export const partition = <T>(array: T[], partitionSize: number): T[][] => {
  const arrayCopy = [...array];
  const partitions: T[][] = [];
  while (arrayCopy.length > partitionSize) {
    partitions.push(arrayCopy.splice(0, partitionSize));
  }
  partitions.push(arrayCopy);
  return partitions;
};
