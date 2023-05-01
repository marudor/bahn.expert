import { getStopPlaceByEva } from '@/server/StopPlace/search';
import type { Route$Stop } from '@/types/routing';

export async function addRL100(stops: Route$Stop[]): Promise<void> {
  await Promise.all(
    stops.map(async (stop) => {
      try {
        const stopPlace = await getStopPlaceByEva(stop.station.id);
        stop.station.rl100 = stopPlace?.identifier?.ril100;
      } catch {
        // best effort
      }
    }),
  );
}
