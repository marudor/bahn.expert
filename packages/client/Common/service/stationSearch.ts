/* eslint import/prefer-default-export: 0 */
import { AllowedHafasProfile } from 'types/HAFAS';
import { Station, StationSearchType } from 'types/station';
import Axios from 'axios';

export async function getStationsFromAPI(
  type: StationSearchType = StationSearchType.default,
  stationString?: string
): Promise<Station[]> {
  if (stationString) {
    return (
      await Axios.get<Station[]>(
        `/api/station/v1/search/${encodeURIComponent(stationString)}`,
        {
          params: { type },
        }
      )
    ).data;
  }

  return [];
}

export async function getHafasStationFromAPI(
  profile?: AllowedHafasProfile,
  stationString?: string
): Promise<Station[]> {
  try {
    return (
      await Axios.get<Station[]>(`/api/hafas/v1/station/${stationString}`, {
        params: {
          profile,
          type: 'S',
        },
      })
    ).data;
  } catch {
    return [];
  }
}

export async function getHafasStationFromCoordinates(
  profile: AllowedHafasProfile = AllowedHafasProfile.DB,
  coordinates: Coordinates
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
  coordinates: Coordinates
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
