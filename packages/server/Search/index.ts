import {
  stationSearch as BusinessHubSearch,
  byName,
  byRl100,
} from 'business-hub';
import { CacheDatabases, createNewCache } from 'server/cache';
import { logger } from 'server/logger';
import { stationSearch as SBBSearch } from 'sbb';
import { StationSearchType } from 'types/station';
import DBNavigatorSearch from 'server/HAFAS/LocMatch';
import OpenDataOfflineSearch from './OpenDataOffline';
import OpenDataSearch from './OpenData';
import StationsDataSearch from './StationsData';
import type { CommonStation, Station } from 'types/station';
import type {
  StopPlace,
  StopPlaceSearchResult,
} from 'business-hub/types/RisStations';

function risMapping(
  stopPlace: StopPlace | StopPlaceSearchResult,
): CommonStation {
  return {
    title: stopPlace.names.DE.nameLong,
    id: stopPlace.evaNumber,
  };
}

const risStationSearch = async (searchTerm: string): Promise<Station[]> => {
  const rawResult = await byName(searchTerm, true);
  return rawResult.map(risMapping);
};

const stationSearchCache = createNewCache<string, Station[]>(
  6 * 60 * 60,
  CacheDatabases.StationSearch,
);

export function getSearchMethod(
  type?: StationSearchType,
): (searchTerm: string) => Promise<Station[]> {
  switch (type) {
    case StationSearchType.hafas:
      return DBNavigatorSearch;
    case StationSearchType.openData:
      return OpenDataSearch;
    case StationSearchType.openDataOffline:
      return OpenDataOfflineSearch;
    case StationSearchType.stationsData:
      return StationsDataSearch;
    case StationSearchType.sbb:
      return SBBSearch;
    case StationSearchType.businessHub:
      return BusinessHubSearch;
    default:
    case StationSearchType.ris:
      return risStationSearch;
  }
}

export default async (
  rawSearchTerm: string,
  type?: StationSearchType,
  maxStations = 6,
): Promise<Station[]> => {
  if (!type || type === StationSearchType.default) {
    type = StationSearchType.ris;
  }
  const searchTerm = rawSearchTerm.replace(/ {2}/g, ' ');
  const cacheKey = `${type}${searchTerm}`;
  const cached = await stationSearchCache.get(cacheKey);

  if (cached) return cached.slice(0, maxStations);

  const rl100Result = byRl100(searchTerm);

  const searchMethod = getSearchMethod(type);

  try {
    let result: Station[] = await searchMethod(searchTerm);

    if (type !== StationSearchType.stationsData && result.length === 0) {
      // this may be a station named from iris - lets try that first
      result = await getSearchMethod(StationSearchType.stationsData)(
        searchTerm,
      );
    }

    const exactMatch = result.find(
      (s) => s.title.toLowerCase() === rawSearchTerm.toLowerCase(),
    );
    if (exactMatch) {
      result = [exactMatch, ...result.filter((s) => s !== exactMatch)];
    }

    const rl100Station = await rl100Result;

    if (rl100Station) {
      result = [risMapping(rl100Station), ...result];
    }

    void stationSearchCache.set(cacheKey, result);

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
