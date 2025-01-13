import { OccupanciesApi } from '@/external/generated/risTransports';
import { risTransportsConfiguration } from '@/external/risTransports/config';
import { axiosUpstreamInterceptor } from '@/server/admin';
import { CacheDatabase, getCache } from '@/server/cache';
import { Temporal } from '@js-temporal/polyfill';
import Axios from 'axios';
const axiosWithTimeout = Axios.create({
	timeout: 4500,
	adapter: 'fetch',
});

axiosUpstreamInterceptor(axiosWithTimeout, 'occupancy-risTransports');

const occupancyClient = new OccupanciesApi(
	risTransportsConfiguration,
	undefined,
	axiosWithTimeout,
);

let allowedAdministrations: string[] = [];
async function fetchAllowedAdministrations() {
	try {
		allowedAdministrations = (
			await occupancyClient.occupancyAdministrations()
		).data.administrations.map((a) => a.administrationID);
	} catch {
		// ignored
	}
}

if (process.env.NODE_ENV === 'production') {
	void fetchAllowedAdministrations();
	setInterval(
		fetchAllowedAdministrations,
		Temporal.Duration.from('P1D').total('millisecond'),
	);
}

const occupancyCache = getCache(CacheDatabase.TransportsOccupancy);

export async function getJourneyOccupancy({
	journeyId,
	administration,
}: {
	journeyId: string;
	administration?: string;
}) {
	if (await occupancyCache.exists(journeyId)) {
		return await occupancyCache.get(journeyId);
	}
	if (administration && allowedAdministrations.length) {
		if (!allowedAdministrations.includes(administration)) {
			return null;
		}
	}
	try {
		const r = await occupancyClient.occupancies({
			journeyOccupanciesRequest: {
				journeys: [
					{
						journeyID: journeyId,
					},
				],
			},
		});
		const occupancy = r.data.occupancies?.at(0);
		void occupancyCache.set(journeyId, occupancy);
		return occupancy;
	} catch {
		occupancyCache.set(journeyId, undefined);
		// ignored, undefined
	}
}
