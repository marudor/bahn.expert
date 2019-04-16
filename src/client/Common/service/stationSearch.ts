/* eslint import/prefer-default-export: 0 */
import { Station } from 'types/station';
import { StationSearchType } from 'Common/config';
import axios from 'axios';

export async function getStationsFromAPI(
  stationString?: string,
  type: StationSearchType = StationSearchType.Default
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
