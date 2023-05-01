import { getSingleStation } from '@/server/iris/station';
import { irisFilter } from '@/server/StopPlace/search';
import { locMatch } from '@/server/HAFAS/LocMatch';
import type { GroupedStopPlace } from '@/types/stopPlace';

async function byRl100(rl100: string): Promise<GroupedStopPlace | void> {
  if (rl100.length > 5) {
    return;
  }
  try {
    const irisRl100 = await getSingleStation(rl100);
    return {
      name: irisRl100.name,
      evaNumber: irisRl100.eva,
      availableTransports: [],
      ril100: irisRl100.ds100,
    };
  } catch {
    // we just return nothing on fail
  }
}

export async function searchWithHafas(
  searchTerm?: string,
  max?: number,
  filterForIris?: boolean,
): Promise<GroupedStopPlace[]> {
  if (!searchTerm) return [];
  const results = await Promise.all([
    await locMatch(searchTerm, 'S'),
    byRl100(searchTerm),
  ]);
  let hafasResult = results[0];
  const rl100ByIris = results[1];
  if (max) {
    hafasResult = hafasResult.splice(0, max);
  }

  const result: GroupedStopPlace[] = hafasResult
    .filter((s) => s.evaNumber.length <= 7 || !s.evaNumber.startsWith('99'))
    .map((s) => ({
      evaNumber: s.evaNumber,
      name: s.name,
      position: {
        latitude: s.coordinates.lat,
        longitude: s.coordinates.lng,
      },
      availableTransports: [],
    }));

  if (rl100ByIris) {
    result.unshift(rl100ByIris);
  }

  if (filterForIris) {
    return irisFilter(result);
  }
  return result;
}
