import { searchStopPlace } from '@/server/StopPlace/search';
import { Cache, CacheDatabase } from '@/server/cache';
import type { RouteAuslastung, SingleRoute } from '@/types/routing';
import { tripSearch } from './TripSearch/TripSearch';

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

	const trips = await tripSearch({
		start: startStation.evaNumber,
		destination: destStation.evaNumber,
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

async function stopOccupancy(
	start: string,
	destination: string,
	trainNumber: string,
	time: Date,
	stopEva: string,
): Promise<RouteAuslastung | undefined> {
	const keyWithouEva = `${start}-${destination}-${trainNumber}-${time}`;
	const key = `${keyWithouEva}-${stopEva}`;
	if (await stopOccupancyCache.exists(key)) {
		return await stopOccupancyCache.get(key);
	}
	const relevantTrip = await getRelevantTrip(
		start,
		destination,
		trainNumber,
		time,
	);

	if (relevantTrip?.segments[0].type !== 'JNY') {
		return;
	}

	await Promise.all([
		relevantTrip.segments[0].stops.map((s) =>
			stopOccupancyCache.set(
				`${keyWithouEva}-${s.station.evaNumber}`,
				s.auslastung,
			),
		),
	]);

	return await stopOccupancyCache.get(key);
}
