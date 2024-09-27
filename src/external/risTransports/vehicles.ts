import { uniqBy } from '@/client/util';
import {
	type MatchVehicleID,
	VehiclesApi,
} from '@/external/generated/risTransports';
import { risTransportsConfiguration } from '@/external/risTransports/config';
import { axiosUpstreamInterceptor } from '@/server/admin';
import { Cache, CacheDatabase } from '@/server/cache';
import Axios from 'axios';
import { addDays, format, isBefore } from 'date-fns';
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
		const [today, tomorrow] = await Promise.all([
			vehiclesClient.journeysByVehicleId({
				vehicleID: vehicleId,
			}),
			vehiclesClient.journeysByVehicleId({
				vehicleID: vehicleId,
				date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
			}),
		]);

		return [...today.data.journeys, ...tomorrow.data.journeys].sort((a, b) =>
			isBefore(
				new Date(a.journeyRelation.startTime),
				new Date(b.journeyRelation.startTime),
			)
				? -1
				: 1,
		);
	} catch {
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

export async function getUmlauf(journeyId: string, vehicleIds: string[]) {
	const cacheKey = `${journeyId}-${vehicleIds.join('-')}`;
	if (await journeyForVehiclesCache.get(cacheKey)) {
		return journeyForVehiclesCache.get(cacheKey);
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
	void journeyForVehiclesCache.set(cacheKey, umlauf);
	return umlauf;
}
