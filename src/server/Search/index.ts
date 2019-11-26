import { logger } from 'server/logger';
import { Station, StationSearchType } from 'types/station';
import { uniqBy } from 'lodash';
import DBNavigatorSearch from 'server/HAFAS/LocMatch';
import FavendoSearch from './Favendo';
import NodeCache from 'node-cache';
import OpenDataOfflineSearch from './OpenDataOffline';
import OpenDataSearch from './OpenData';
import StationsDataSearch from './StationsData';

export async function favendoStationsDataCombined(
  searchTerm: string
): Promise<Station[]> {
  const stations = await Promise.all([
    FavendoSearch(searchTerm),
    StationsDataSearch(searchTerm),
  ]);

  return uniqBy(stations.flat(), 'id');
}

export function getSearchMethod(type?: StationSearchType) {
  switch (type) {
    case StationSearchType.hafas:
      return DBNavigatorSearch;
    case StationSearchType.openData:
      return OpenDataSearch;
    case StationSearchType.openDataOffline:
      return OpenDataOfflineSearch;
    case StationSearchType.stationsData:
      return StationsDataSearch;
    default:
    case StationSearchType.favendo:
      return FavendoSearch;
    case StationSearchType.favendoStationsData:
      return favendoStationsDataCombined;
  }
}

const searchCaches: Map<Function, NodeCache> = new Map();
// 6 Hours in seconds
const stdTTL = 6 * 60 * 60;

function getCache(key: Function) {
  const cached = searchCaches.get(key);

  if (cached) {
    return cached;
  }
  const cache: NodeCache = new NodeCache({ stdTTL });

  searchCaches.set(key, cache);

  return cache;
}

export default async (
  rawSearchTerm: string,
  type?: StationSearchType,
  maxStations: number = 6
) => {
  const searchTerm = rawSearchTerm.replace(/ {2}/g, ' ');

  try {
    const searchMethod = getSearchMethod(type);
    const cache = getCache(searchMethod);

    const cached = cache.get<Station[]>(searchTerm);

    if (cached) {
      return cached.slice(0, maxStations);
    }

    let result = await getSearchMethod(type)(searchTerm);

    if (type !== StationSearchType.stationsData && result.length === 0) {
      // this may be a station named from iris - lets try that first
      result = await getSearchMethod(StationSearchType.stationsData)(
        searchTerm
      );
    }

    cache.set(searchTerm, result);

    return result.slice(0, maxStations);
  } catch (e) {
    const message = 'search failed';

    logger.error(message, {
      searchMethod: type,
      error: {
        ...(e.response && {
          statusText: e.response.statustext,
          data: e.response.data,
          status: e.response.status,
        }),
        raw: e,
      },
    });

    throw e;
  }
};
