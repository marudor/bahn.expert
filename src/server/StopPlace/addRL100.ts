import { getStopPlaceByEva } from '@/server/StopPlace/search';
import type { RouteStop } from '@/types/routing';

export async function addRL100(stops: RouteStop[]): Promise<void> {
  await Promise.all(
    stops.map(async (stop) => {
      try {
        const stopPlace = await getStopPlaceByEva(stop.station.evaNumber);
        stop.station.ril100 = stopPlace?.ril100;
      } catch {
        // best effort
      }
    }),
  );
}
