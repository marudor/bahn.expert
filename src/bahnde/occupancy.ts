import { routing } from '@/bahnde/routing/routing';
import { searchStopPlace } from '@/server/StopPlace/search';
import { Cache, CacheDatabase } from '@/server/cache';
import type {
	RouteAuslastung,
	RoutingResult,
	SingleRoute,
} from '@/types/routing';
import { tz } from '@date-fns/tz';
import { formatISO } from 'date-fns';

async function getRelevantTrip(
	start: string,
	destination: string,
	trainNumber: string,
	time: Date,
): Promise<SingleRoute | undefined> {
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
	});

	const relevantTrip = trips.routes.find((t) =>
		t.segments.some(
			(s) =>
				s.type === 'JNY' &&
				(s.train.number === trainNumber ||
					Boolean(s.wings?.some((w) => w.train.number === trainNumber))),
		),
	);

	return relevantTrip;
}

const stopOccupancyCache = new Cache<RouteAuslastung | undefined>(
	CacheDatabase.HafasStopOccupancy,
);

export function setOccupanciesOfRoutes(routes: RoutingResult['routes']) {
	for (const route of routes) {
		for (const segment of route.segments) {
			if (
				segment.type === 'JNY' &&
				segment.train.number &&
				segment.train.number !== '0' &&
				segment.auslastung
			) {
				const baseKey = `${segment.segmentStart.name}:${segment.segmentDestination.name}:${segment.train.number}:${formatISO(segment.departure.scheduledTime, { in: tz('UTC') })}`;
				for (const stop of segment.stops) {
					if (stop.auslastung) {
						void stopOccupancyCache.set(
							`${baseKey}:${stop.station.evaNumber}`,
							stop.auslastung,
						);
					}
				}
			}
		}
	}
}

export async function bahnDeOccupancy(
	start: string,
	destination: string,
	trainNumber: string,
	time: Date,
	stopEva: string,
): Promise<RouteAuslastung | undefined> {
	const keyWithouEva = `${start}:${destination}:${trainNumber}:${formatISO(time, { in: tz('UTC') })}`;
	const key = `${keyWithouEva}:${stopEva}`;
	if (await stopOccupancyCache.exists(key)) {
		return await stopOccupancyCache.get(key);
	}
	await getRelevantTrip(start, destination, trainNumber, time);

	return await stopOccupancyCache.get(key);
}
