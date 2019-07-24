/* eslint import/prefer-default-export: 0 */
import { Station } from 'types/station';
import { StationSearchType } from 'Common/config';
import axios from 'axios';

export async function getStationsFromAPI(
  stationString?: string,
  type: StationSearchType = StationSearchType.Default,
  coordinates?: Coordinates
): Promise<Station[]> {
  if (stationString) {
    let req;

    if (coordinates && stationString === '__GEO_HACK__') {
      req = axios.get('/api/station/current/geoSearch', {
        params: {
          lat: coordinates.latitude,
          lng: coordinates.longitude,
        },
      });
    } else {
      req = axios.get(`/api/station/current/search/${stationString}`, {
        params: { type },
      });
    }
    const item = (await req).data;

    return item;
  }

  return Promise.resolve([]);
}
