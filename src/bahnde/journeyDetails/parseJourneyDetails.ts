import { mapHalt } from '@/bahnde/parsing';
import type { BahnDEFahrt } from '@/bahnde/types';
import type { JourneyResponse } from '@/types/journey';

export async function mapFahrt(
	input?: BahnDEFahrt,
): Promise<JourneyResponse | undefined> {
	if (!input) {
		return undefined;
	}
	const stops = await Promise.all(input.halte.map(mapHalt));

	const firstStop = stops.at(0);
	const lastStop = stops.at(-1);
	const firstHalt = input.halte.at(0);

	if (!firstStop || !lastStop || !firstHalt) {
		return undefined;
	}

	return {
		finalDestination: lastStop.station.name,
		arrival: lastStop.arrival!,
		departure: firstStop.departure!,
		cancelled: input.cancelled || undefined,
		segmentStart: firstStop.station,
		segmentDestination: firstStop.station,
		stops,
		train: {
			name: input.zugName,
			number: firstHalt.nummer,
			transportType: 'UNKNOWN',
		},
		// TODO: Polyline
		type: 'JNY',
	};
}
