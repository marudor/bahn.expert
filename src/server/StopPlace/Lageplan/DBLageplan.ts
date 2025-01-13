import { getStopPlaceByEva } from '@/server/StopPlace/search';
import { CacheDatabase, getCache } from '@/server/cache';
import Axios from 'axios';

const cache = getCache(CacheDatabase.DBLageplan);

export async function getDBLageplan(
	evaNumber: string,
): Promise<string | undefined> {
	try {
		const cached = await getCachedDBLageplan(evaNumber);

		if (cached) return cached;
		// undefined = haven't tried yet
		// null = already tried to fetch, but nothing found
		if (cached === null) return undefined;

		const stopPlace = await getStopPlaceByEva(evaNumber);
		if (stopPlace?.stationId) {
			const lageplanUrl = `https://www.bahnhof.de/downloads/station-plans/${stopPlace.stationId}.pdf`;
			try {
				await Axios.get(lageplanUrl);
				void cache.set(evaNumber, lageplanUrl);
				return lageplanUrl;
			} catch (e) {
				if (!Axios.isAxiosError(e) || e.status !== 404) {
					throw e;
				}
			}
		}
		void cache.set(evaNumber, null);
	} catch {
		// we just return nothing
	}
	return undefined;
}

export function getCachedDBLageplan(
	stationName: string,
): Promise<string | null | undefined> {
	return cache.get(stationName);
}
