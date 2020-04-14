import { CacheDatabases, createNewCache } from 'server/cache';
import { logger } from 'server/logger';
import { Station, StationSearchType } from 'types/station';
import BusinessHubSearch, {
  canUseBusinessHub,
} from 'server/Search/BusinessHub';
import Client, { Counter } from 'prom-client';
import DBNavigatorSearch from 'server/HAFAS/LocMatch';
import DS100 from 'server/Search/DS100';
import FavendoSearch from './Favendo';
import OpenDataOfflineSearch from './OpenDataOffline';
import OpenDataSearch from './OpenData';
import StationsDataSearch from './StationsData';

const defaultSearch = canUseBusinessHub ? BusinessHubSearch : FavendoSearch;

const stationSearchCache = createNewCache<string, Station[]>(
  6 * 60 * 60,
  CacheDatabases.StationSearch
);

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
    case StationSearchType.favendo:
      return FavendoSearch;
    case StationSearchType.businessHub:
      return BusinessHubSearch;
    default:
      return defaultSearch;
  }
}

const counterByType = new Map<StationSearchType, Counter<string>>();

function increaseCounter(type: StationSearchType) {
  let counter = counterByType.get(type);

  if (!counter) {
    counter = new Client.Counter({
      aggregator: 'average',
      registers: [Client.register],
      name: `${type}StationSearch`,
      help: `${type} cache miss`,
    });
    counterByType.set(type, counter);
  }
  counter.inc();
}

export default async (
  rawSearchTerm: string,
  type?: StationSearchType,
  maxStations: number = 6
) => {
  const searchTerm = rawSearchTerm.replace(/ {2}/g, ' ');
  const cacheKey = `${type}${searchTerm}`;
  const cached = await stationSearchCache.get(cacheKey);

  if (cached) return cached.slice(0, maxStations);

  const ds100Search = DS100(searchTerm);

  const searchMethod = getSearchMethod(type);

  increaseCounter(type || StationSearchType.default);

  try {
    let result = await searchMethod(searchTerm);

    if (type !== StationSearchType.stationsData && result.length === 0) {
      // this may be a station named from iris - lets try that first
      result = await getSearchMethod(StationSearchType.stationsData)(
        searchTerm
      );
    }

    const ds100Station = await ds100Search;

    if (ds100Station) {
      result = [ds100Station, ...result];
    }

    stationSearchCache.set(cacheKey, result);

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
