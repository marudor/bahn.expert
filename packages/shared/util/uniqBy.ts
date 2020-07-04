export default <T>(array: T[], identifier: keyof T): T[] => {
  const seen: unknown[] = [];
  return array.filter((item) => {
    if (!seen.includes(item[identifier])) {
      seen.push(item[identifier]);
      return true;
    }
    return false;
  });
};
