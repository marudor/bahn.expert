/* eslint import/prefer-default-export: 0 */
import Axios from 'axios';
import type { GroupedStopPlace } from 'types/stopPlace';

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
  groupedBySales?: boolean,
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
            groupedBySales,
          },
        },
      )
    ).data;
  }
  return [];
}

export async function getStopPlacesFromCoordinates(
  filterForIris: boolean,
  max?: number,
  coordinates?: GeolocationCoordinates,
): Promise<GroupedStopPlace[]> {
  if (!coordinates) return [];
  try {
    return (
      await Axios.get<GroupedStopPlace[]>('/api/stopPlace/v1/geoSearch', {
        params: {
          lat: coordinates.latitude,
          lng: coordinates.longitude,
          filterForIris,
          max,
        },
      })
    ).data;
  } catch {
    return [];
  }
}
