/* eslint import/prefer-default-export: 0 */
import { AllowedHafasProfile } from 'types/HAFAS';
import { Station, StationSearchType } from 'types/station';
import axios from 'axios';

export async function getStationsFromAPI(
  type: StationSearchType = StationSearchType.default,
  stationString?: string
): Promise<Station[]> {
  if (stationString) {
    return (
      await axios.get(
        `/api/station/v1/search/${encodeURIComponent(stationString)}`,
        {
          params: { type },
        }
      )
    ).data;
  }

  return Promise.resolve([]);
}

export async function getHafasStationFromAPI(
  profile?: AllowedHafasProfile,
  stationString?: string
): Promise<Station[]> {
  return (
    await axios.get(`/api/hafas/v1/station/${stationString}`, {
      params: {
        profile,
      },
    })
  ).data;
}

export async function getHafasStationFromCoordinates(
  profile: AllowedHafasProfile = AllowedHafasProfile.db,
  coordinates: Coordinates
) {
  return (
    await axios.get('/api/hafas/v1/geoStation', {
      params: {
        lat: coordinates.latitude,
        lng: coordinates.longitude,
        profile,
      },
    })
  ).data;
}

export async function getStationsFromCoordinates(coordinates: Coordinates) {
  return (
    await axios.get('/api/station/v1/geoSearch', {
      params: {
        lat: coordinates.latitude,
        lng: coordinates.longitude,
      },
    })
  ).data;
}
