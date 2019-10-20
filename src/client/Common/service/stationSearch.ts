/* eslint import/prefer-default-export: 0 */
import { AllowedHafasProfile } from 'types/HAFAS';
import { AllowedStationAPIs } from 'types/api/station';
import { Station } from 'types/station';
import { StationSearchType } from 'Common/config';
import axios from 'axios';

export async function getStationsFromAPI(
  type: AllowedStationAPIs = StationSearchType.Default,
  stationString?: string
): Promise<Station[]> {
  if (stationString) {
    return (await axios.get(
      `/api/station/current/search/${encodeURIComponent(stationString)}`,
      {
        params: { type },
      }
    )).data;
  }

  return Promise.resolve([]);
}

export async function getHafasStationFromAPI(
  profile?: AllowedHafasProfile,
  stationString?: string
): Promise<Station[]> {
  return (await axios.get(`/api/hafas/current/station/${stationString}`, {
    params: {
      profile,
    },
  })).data;
}

export async function getHafasStationFromCoordinates(
  profile: AllowedHafasProfile = AllowedHafasProfile.db,
  coordinates: Coordinates
) {
  return (await axios.get('/api/hafas/current/geoStation', {
    params: {
      lat: coordinates.latitude,
      lng: coordinates.longitude,
      profile,
    },
  })).data;
}

export async function getStationsFromCoordinates(coordinates: Coordinates) {
  return (await axios.get('/api/station/current/geoSearch', {
    params: {
      lat: coordinates.latitude,
      lng: coordinates.longitude,
    },
  })).data;
}
