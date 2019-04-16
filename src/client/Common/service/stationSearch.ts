/* eslint import/prefer-default-export: 0 */
import { Station } from 'types/station';
import axios from 'axios';

export async function getStationsFromAPI(
  stationString?: string,
  type: StationSearchType = ''
): Promise<Station[]> {
  if (stationString) {
    return (await axios.get(`/api/search/${stationString}`, {
      params: {
        type,
      },
    })).data;
  }

  return Promise.resolve([]);
}
