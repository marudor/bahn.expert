/* eslint import/prefer-default-export: 0 */
import { Station } from 'types/station';
import { StationSearchType } from 'Common/config';
import axios from 'axios';

export async function getStationsFromAPI(
  stationString?: string,
  type: StationSearchType = StationSearchType.Default
): Promise<Station[]> {
  if (stationString) {
    const item = (await axios.get(
      `/api/station/current/search/${stationString}`,
      {
        params: {
          type,
        },
      }
    )).data;

    return item;
  }

  return Promise.resolve([]);
}
