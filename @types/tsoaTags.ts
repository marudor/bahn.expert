import '@tsoa/runtime';

declare module '@tsoa/runtime' {
  export type Tag =
    | 'HAFAS'
    | 'Journeys'
    | 'IRIS'
    | 'StopPlace'
    | 'CoachSequence';

  // eslint-disable-next-line @typescript-eslint/ban-types
  export function Tags(...values: Tag[]): Function;
  export function Tags(...values: string[]): never;
}
