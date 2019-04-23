/* eslint import/prefer-default-export: 0 */
import { Station } from 'types/station';
import { StationSearchType } from 'Common/config';
import axios from 'axios';

function tryParse(s: null | string) {
  if (s) {
    try {
      return JSON.parse(s);
    } catch (e) {
      // implicit undefined
    }
  }
}
export async function getStationsFromAPI(
  stationString?: string,
  type: StationSearchType = StationSearchType.Default
): Promise<Station[]> {
  if (stationString) {
    const cacheKey = `S${type}${stationString}`;
    const cached = tryParse(localStorage.getItem(cacheKey));

    if (cached) return cached;
    const item = (await axios.get(`/api/search/${stationString}`, {
      params: {
        type,
      },
    })).data;

    localStorage.setItem(cacheKey, JSON.stringify(item));

    return item;
  }

  return Promise.resolve([]);
}
