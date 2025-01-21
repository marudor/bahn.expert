import { bahnJourneyDetails } from '@/bahnde/journeyDetails/journeyDetails';
import { routing } from '@/bahnde/routing/routing';
import { searchStopPlace } from '@/server/StopPlace/search';
import { CacheDatabase, getCache } from '@/server/cache';
import { journeyDetails } from '@/server/journeys/v2/journeyDetails';
import type { RouteAuslastung, RouteJourneySegment } from '@/types/routing';

async function getRelevantSegment(
	start: string,
	destination: string,
	trainNumber: string,
	time: Date,
): Promise<RouteJourneySegment | undefined> {
	const startStations = await searchStopPlace(start, 1);
	const destStations = await searchStopPlace(destination, 1);

	const startStation = startStations[0];
	const destStation = destStations[0];

	if (!startStation) {
		throw {
			message: 'Start Station unknown',
			data: start,
		};
	}
	if (!destStation) {
		throw {
			message: 'Destination Station unknown',
			data: destination,
		};
	}

	const trips = await routing({
		start: {
			type: 'stopPlace',
			evaNumber: startStation.evaNumber,
		},
		destination: {
			type: 'stopPlace',
			evaNumber: destStation.evaNumber,
		},
		time,
		maxChanges: 0,
		useV6: true,
	});

	const relevantSegments = trips.routes
		.map((t) =>
			t.segments.find(
				(s) =>
					s.type === 'JNY' &&
					(s.train.number === trainNumber ||
						Boolean(s.wings?.some((w) => w.train.number === trainNumber))),
			),
		)
		.filter(Boolean);

	return relevantSegments[0];
}

const stopOccupancyCache = getCache(CacheDatabase.HafasStopOccupancy);

export async function bahnDeOccupancy(
	journeyId: string,
	stopEva: string,
): Promise<RouteAuslastung | undefined> {
	const occupancies = await fullBahnDeOccupancy(journeyId);

	if (occupancies) {
		return occupancies[stopEva];
	}
}

export async function fullBahnDeOccupancy(journeyId: string) {
	if (await stopOccupancyCache.exists(journeyId)) {
		return await stopOccupancyCache.get(journeyId);
	}
	const journey = await journeyDetails(journeyId);
	if (!journey) {
		return;
	}
	const uncancelledStops = journey.stops.filter((s) => !s.cancelled);
	const firstStop = uncancelledStops.at(0);
	const lastStop = uncancelledStops.at(-1);
	if (!firstStop || !lastStop) {
		return;
	}
	const relevantSegment = await getRelevantSegment(
		firstStop.station.name,
		lastStop.station.name,
		journey.train.number!,
		firstStop.departure!.scheduledTime,
	);
	if (
		!relevantSegment ||
		relevantSegment.type !== 'JNY' ||
		!relevantSegment.jid
	) {
		return;
	}
	const bahnDeDetails = await bahnJourneyDetails(relevantSegment.jid, true);
	if (!bahnDeDetails) {
		return;
	}
	const occupancies: Record<string, RouteAuslastung> = {};
	for (const stop of bahnDeDetails.stops) {
		if (stop.auslastung) {
			occupancies[stop.station.evaNumber] = stop.auslastung;
		}
	}
	void stopOccupancyCache.set(journeyId, occupancies);
	return occupancies;
}
