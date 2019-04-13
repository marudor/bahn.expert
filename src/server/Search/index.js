// @flow
import { flatten, uniqBy } from 'lodash';
import { logger } from 'server/logger';
import DBNavigatorSearch from './DBNavigator';
import FavendoSearch from './Favendo';
import HafasSearch from './Hafas';
import NodeCache from 'node-cache';
import OpenDataOfflineSearch from './OpenDataOffline';
import OpenDataSearch from './OpenData';
import OpenDBSearch from './OpenDB';
import StationsDataSearch from './StationsData';
import type { Station } from 'types/station';

export async function favendoOpenDBCombined(
  searchTerm: string
): Promise<Station[]> {
  const stations = await Promise.all([
    FavendoSearch(searchTerm),
    OpenDBSearch(searchTerm),
  ]);

  return uniqBy(flatten(stations), 'id');
}

export function getSearchMethod(type: ?StationSearchType) {
  switch (type) {
    case 'dbNav':
      return DBNavigatorSearch;
    case 'openData':
      return OpenDataSearch;
    case 'openDataOffline':
      return OpenDataOfflineSearch;
    case 'openDB':
      return OpenDBSearch;
    case 'hafas':
      return HafasSearch;
    case 'favOpenDB':
      return favendoOpenDBCombined;
    case 'stationsData':
      return StationsDataSearch;
    case 'favendo':
    default:
      return FavendoSearch;
  }
}

const searchCaches: Map<Function, NodeCache<string, Station[]>> = new Map();
// 6 Hours in seconds
const stdTTL = 6 * 60 * 60;

function getCache(key: Function) {
  const cached = searchCaches.get(key);

  if (cached) {
    return cached;
  }
  const cache: NodeCache<string, Station[]> = new NodeCache({ stdTTL });

  searchCaches.set(key, cache);

  return cache;
}

export default async (rawSearchTerm: string, type: ?StationSearchType) => {
  const searchTerm = rawSearchTerm.replace(/ {2}/g, ' ');

  try {
    const searchMethod = getSearchMethod(type);
    const cache = getCache(searchMethod);
    const cached = cache.get(searchTerm);

    if (cached) {
      return cached;
    }

    let result = await getSearchMethod(type)(searchTerm);

    if (type !== 'stationsData' && result.length === 0) {
      // this may be a station named from iris - lets try that first
      result = await getSearchMethod('stationsData')(searchTerm);
    }

    cache.set(searchTerm, result);

    return result;
  } catch (e) {
    const isDefault = !type || type === 'favendo';
    let message = 'search failed';

    if (!isDefault) {
      message += ', falling back to default';
    }
    logger.error(message, {
      searchMethod: type,
      error: {
        statusText: e.response?.statusText,
        data: e.response?.data,
        status: e.response?.status,
        raw: e,
      },
    });

    if (isDefault) {
      throw e;
    }

    return getSearchMethod('favendo')(searchTerm);
  }
};
