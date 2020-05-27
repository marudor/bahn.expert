/* eslint import/prefer-default-export: 0 */
import { AllowedHafasProfile } from 'types/HAFAS';
import { Station, StationSearchType } from 'types/station';
import request from 'umi-request';

export async function getStationsFromAPI(
  type: StationSearchType = StationSearchType.default,
  stationString?: string
): Promise<Station[]> {
  if (stationString) {
    return await request.get<Station[]>(
      `/api/station/v1/search/${encodeURIComponent(stationString)}`,
      {
        params: { type },
      }
    );
  }

  return [];
}

export async function getHafasStationFromAPI(
  profile?: AllowedHafasProfile,
  stationString?: string
): Promise<Station[]> {
  try {
    return await request.get<Station[]>(
      `/api/hafas/v1/station/${stationString}`,
      {
        params: {
          profile,
          type: 'S',
        },
      }
    );
  } catch {
    return [];
  }
}

export async function getHafasStationFromCoordinates(
  profile: AllowedHafasProfile = AllowedHafasProfile.DB,
  coordinates: Coordinates
) {
  try {
    return await request.get<Station[]>('/api/hafas/v1/geoStation', {
      params: {
        lat: coordinates.latitude,
        lng: coordinates.longitude,
        profile,
      },
    });
  } catch {
    return [];
  }
}

export async function getStationsFromCoordinates(coordinates: Coordinates) {
  return await request.get<Station[]>('/api/station/v1/geoSearch', {
    params: {
      lat: coordinates.latitude,
      lng: coordinates.longitude,
    },
  });
}
