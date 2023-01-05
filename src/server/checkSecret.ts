export function checkSecrets<T extends string>(
  ...secrets: (T | undefined)[]
): void {
  if (
    process.env.NODE_ENV === 'production' &&
    process.env.TEST_RUN !== '1' &&
    !secrets.map((s) => s?.trim()).every(Boolean)
  ) {
    throw new Error('Missing secrets');
  }
}
