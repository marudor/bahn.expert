import '@tsoa/runtime';

declare module '@tsoa/runtime' {
  type DeprecatedTag = 'OEBB';
  export type Tag =
    | 'HAFAS'
    | 'Journeys'
    | 'IRIS'
    | 'StopPlace'
    | 'Reihung'
    | DeprecatedTag;

  // eslint-disable-next-line @typescript-eslint/ban-types
  export function Tags(...values: Tag[]): Function;
  export function Tags(...values: string[]): never;
}
