export default <T>(
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
