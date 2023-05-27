/* eslint import/prefer-default-export: 0 */
import Axios from 'axios';
import type { GroupedStopPlace } from '@/types/stopPlace';

export async function getStopPlaceFromAPI(
  evaNumber: string,
): Promise<GroupedStopPlace | undefined> {
  return (
    await Axios.get<GroupedStopPlace | undefined>(
      `/api/stopPlace/v1/${evaNumber}`,
    )
  ).data;
}

export async function getStopPlacesFromAPI(
  filterForIris?: boolean,
  max?: number,
  _groupedBySales?: boolean,
  searchTerm?: string,
): Promise<GroupedStopPlace[]> {
  if (searchTerm) {
    return (
      await Axios.get<GroupedStopPlace[]>(
        `/api/stopPlace/v1/search/${encodeURIComponent(searchTerm)}`,
        {
          params: {
            filterForIris,
            max,
            // This groups stuff with different names and confuses users. Only group stuff with the same name! (maybe upstream?)
            // groupedBySales,
          },
        },
      )
    ).data;
  }
  return [];
}
