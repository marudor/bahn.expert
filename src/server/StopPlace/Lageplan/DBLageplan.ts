import { Cache, CacheDatabase } from '@/server/cache';
import { getStopPlaceByEva } from '@/server/StopPlace/search';
import Axios from 'axios';

// 48 hours in seconds
const cache = new Cache<string, string | null>(
  CacheDatabase.DBLageplan,
  48 * 60 * 60,
);

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
    if (stopPlace?.identifier?.stationId) {
      const lageplanUrl = `https://www.bahnhof.de/downloads/station-plans/${stopPlace.identifier.stationId}.pdf`;
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
