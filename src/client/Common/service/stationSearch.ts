/* eslint import/prefer-default-export: 0 */
import { AllowedStationAPIs } from 'types/api/station';
import { Station } from 'types/station';
import { StationSearchType } from 'Common/config';
import axios from 'axios';

export async function getStationsFromAPI(
  stationString?: string,
  type: AllowedStationAPIs = StationSearchType.Default
): Promise<Station[]> {
  if (stationString) {
    return (await axios.get(`/api/station/current/search/${stationString}`, {
      params: { type },
    })).data;
  }

  return Promise.resolve([]);
}

export async function getStationsFromCoordinates(coordinates: Coordinates) {
  return (await axios.get('/api/station/current/geoSearch', {
    params: {
      lat: coordinates.latitude,
      lng: coordinates.longitude,
    },
  })).data;
}
