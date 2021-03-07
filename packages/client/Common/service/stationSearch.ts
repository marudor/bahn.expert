/* eslint import/prefer-default-export: 0 */
import { AllowedHafasProfile } from 'types/HAFAS';
import { StationSearchType } from 'types/station';
import Axios from 'axios';
import type { Station } from 'types/station';

export async function getStationsFromAPI(
  type: StationSearchType = StationSearchType.default,
  stationString?: string,
): Promise<Station[]> {
  if (stationString) {
    return (
      await Axios.get<Station[]>(
        `/api/station/v1/search/${encodeURIComponent(stationString)}`,
        {
          params: { type },
        },
      )
    ).data;
  }

  return [];
}

export async function getHafasStationFromAPI(
  profile?: AllowedHafasProfile,
  stationString?: string,
): Promise<Station[]> {
  try {
    if (stationString) {
      return (
        await Axios.get<Station[]>(
          `/api/hafas/v1/station/${encodeURIComponent(stationString)}`,
          {
            params: {
              profile,
              type: 'S',
            },
          },
        )
      ).data;
    }
    return [];
  } catch {
    return [];
  }
}

export async function getHafasStationFromCoordinates(
  profile: AllowedHafasProfile = AllowedHafasProfile.DB,
  coordinates: GeolocationCoordinates,
): Promise<Station[]> {
  try {
    return (
      await Axios.get<Station[]>('/api/hafas/v1/geoStation', {
        params: {
          lat: coordinates.latitude,
          lng: coordinates.longitude,
          profile,
        },
      })
    ).data;
  } catch {
    return [];
  }
}

export async function getStationsFromCoordinates(
  coordinates: GeolocationCoordinates,
): Promise<Station[]> {
  return (
    await Axios.get<Station[]>('/api/station/v1/geoSearch', {
      params: {
        lat: coordinates.latitude,
        lng: coordinates.longitude,
      },
    })
  ).data;
}
