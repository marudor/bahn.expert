import { SearchAllResult, StationSearchType } from 'types/station';
import stationSearch from 'server/Search';

export async function searchAll(searchTerm: string): Promise<SearchAllResult> {
  // @ts-expect-error
  const result: SearchAllResult = {};

  await Promise.all(
    Object.values(StationSearchType).map(async (type) => {
      result[type] = await stationSearch(searchTerm, type);
    })
  );

  return result;
}
