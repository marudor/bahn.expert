// @flow
declare module 'debounce-promise' {
  declare module.exports: <T: () => Promise<any>>(fn: T, ms: number) => T;
}
