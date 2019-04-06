// @flow
/* eslint import/prefer-default-export: 0 */
import axios from 'axios';
import type { Station } from 'types/station';

export async function getStationsFromAPI(stationString: ?string, type: StationSearchType = ''): Promise<Station[]> {
  if (stationString) {
    return (await axios.get(`/api/search/${stationString}`, {
      params: {
        type,
      },
    })).data;
  }

  return Promise.resolve([]);
}
