export function checkSecrets<T extends string>(
  ...secrets: (T | undefined)[]
): void {
  if (
    process.env.NODE_ENV === 'production' &&
    !secrets.map((s) => s?.trim()).every(Boolean)
  ) {
    throw new Error('Missing secrets');
  }
}
