export default (duration: string | undefined | null) => {
  if (!duration) return 0;
  const sanitized = duration.padStart(8, '0');
  const days = Number.parseInt(sanitized.slice(0, 2), 10);
  const hours = Number.parseInt(sanitized.slice(2, 4), 10);
  const minutes = Number.parseInt(sanitized.slice(4, 6), 10);
  const seconds = Number.parseInt(sanitized.slice(6, 8), 10);

  return (
    (seconds + minutes * 60 + hours * 60 * 60 + days * 60 * 60 * 24) * 1000
  );
};
