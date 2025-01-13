import { uniqBy } from '@/client/util';
import {
	type MatchVehicleID,
	VehiclesApi,
} from '@/external/generated/risTransports';
import {
	isWithin20Hours,
	risTransportsConfiguration,
} from '@/external/risTransports/config';
import { axiosUpstreamInterceptor } from '@/server/admin';
import { Cache, CacheDatabase } from '@/server/cache';
import { journeyDetails } from '@/server/journeys/v2/journeyDetails';
import Axios from 'axios';
import { addDays, format, isBefore, subDays } from 'date-fns';
const axiosWithTimeout = Axios.create({
	timeout: 4500,
	adapter: 'fetch',
});

axiosUpstreamInterceptor(axiosWithTimeout, 'vehicles-risTransports');

type CacheType = {
	previousJourneys: MatchVehicleID[];
	nextJourneys: MatchVehicleID[];
};
const journeyForVehiclesCache = new Cache<CacheType>(
	CacheDatabase.JourneysForVehicle,
);

const vehiclesClient = new VehiclesApi(
	risTransportsConfiguration,
	undefined,
	axiosWithTimeout,
);

async function getJourneysForVehicle(vehicleId: string) {
	try {
		const journeys = (
			await Promise.allSettled([
				vehiclesClient.journeysByVehicleId({
					vehicleID: vehicleId,
					date: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
				}),
				vehiclesClient.journeysByVehicleId({
					vehicleID: vehicleId,
				}),
				vehiclesClient.journeysByVehicleId({
					vehicleID: vehicleId,
					date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
				}),
			])
		).flatMap((r) => (r.status === 'fulfilled' ? r.value.data.journeys : []));

		return journeys.sort((a, b) =>
			isBefore(
				new Date(a.journeyRelation.startTime),
				new Date(b.journeyRelation.startTime),
			)
				? -1
				: 1,
		);
	} catch (e) {
		// failed
		return [];
	}
}

async function getPreviousNext(journeyId: string, vehicleId: string) {
	const journeys = await getJourneysForVehicle(vehicleId);
	const currentJourneyIndex = journeys.findIndex(
		(j) => j.journeyID === journeyId,
	);
	return {
		nextJourney: journeys.at(currentJourneyIndex + 1),
		previousJourney:
			currentJourneyIndex > 0
				? journeys.at(currentJourneyIndex - 1)
				: undefined,
	};
}

const allowedUmlaufTransportTypes = [
	'HIGH_SPEED_TRAIN',
	'INTERCITY_TRAIN',
	'INTER_REGIONAL_TRAIN',
	'REGIONAL_TRAIN',
];

export async function getUmlauf(journeyId: string, vehicleIds: string[]) {
	if (!vehicleIds.length) {
		return;
	}
	const cacheKey = `${journeyId}-${vehicleIds.join('-')}`;
	if (await journeyForVehiclesCache.exists(cacheKey)) {
		return journeyForVehiclesCache.get(cacheKey);
	}
	const journey = await journeyDetails(journeyId);
	if (
		!journey ||
		!allowedUmlaufTransportTypes.includes(journey.train.transportType)
	) {
		return;
	}
	if (!isWithin20Hours(journey?.departure.scheduledTime)) {
		return;
	}

	const prevNext = await Promise.all(
		vehicleIds.map((v) => getPreviousNext(journeyId, v)),
	);

	const next = prevNext.map((p) => p.nextJourney).filter(Boolean);
	const previous = prevNext.map((p) => p.previousJourney).filter(Boolean);

	const umlauf = {
		previousJourneys: uniqBy(previous, 'journeyID'),
		nextJourneys: uniqBy(next, 'journeyID'),
	};
	journeyForVehiclesCache.set(cacheKey, umlauf);
	return umlauf;
}
