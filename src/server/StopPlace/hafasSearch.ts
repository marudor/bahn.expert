import { irisFilter } from 'server/StopPlace/search';
import LocMatch from 'server/HAFAS/LocMatch';
import type { GroupedStopPlace } from 'types/stopPlace';

export async function searchWithHafas(
  searchTerm?: string,
  max?: number,
  filterForIris?: boolean,
): Promise<GroupedStopPlace[]> {
  if (!searchTerm) return [];
  let hafasResult = await LocMatch(searchTerm, 'S');
  if (max) {
    hafasResult = hafasResult.splice(0, max);
  }

  const result: GroupedStopPlace[] = hafasResult
    .filter((s) => s.id.length <= 7 || !s.id.startsWith('99'))
    .map((s) => ({
      evaNumber: s.id,
      name: s.title,
      position: {
        latitude: s.coordinates.lat,
        longitude: s.coordinates.lng,
      },
      availableTransports: [],
    }));

  if (filterForIris) {
    return irisFilter(result);
  }
  return result;
}
