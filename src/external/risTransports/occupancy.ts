import {
	type JourneyOccupancy,
	OccupanciesApi,
} from '@/external/generated/risTransports';
import { risTransportsConfiguration } from '@/external/risTransports/config';
import { axiosUpstreamInterceptor } from '@/server/admin';
import { Cache, CacheDatabase } from '@/server/cache';
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

const occupancyCache = new Cache<JourneyOccupancy | undefined>(
	CacheDatabase.TransportsOccupancy,
);

export async function getJourneyOccupancy({
	journeyId,
}: {
	journeyId: string;
}) {
	if (await occupancyCache.exists(journeyId)) {
		return await occupancyCache.get(journeyId);
	}
	try {
		const r = await occupancyClient.occupancyByJourneyId({
			journeyID: journeyId,
		});
		void occupancyCache.set(journeyId, r.data);
		return r.data;
	} catch {
		occupancyCache.set(journeyId, undefined);
		// ignored, undefined
	}
}
