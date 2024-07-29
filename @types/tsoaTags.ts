import '@tsoa/runtime';

declare module '@tsoa/runtime' {
	export type Tag =
		| 'HAFAS'
		| 'Journeys'
		| 'IRIS'
		| 'StopPlace'
		| 'CoachSequence';

	// biome-ignore lint/complexity/noBannedTypes: Only used as Decorator
	export function Tags(...values: Tag[]): Function;
	export function Tags(...values: string[]): never;
}
