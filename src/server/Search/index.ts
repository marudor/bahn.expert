import { logger } from 'server/logger';
import { StationSearchType } from 'types/station';
import BusinessHubSearch, {
  canUseBusinessHub,
} from 'server/Search/BusinessHub';
import DBNavigatorSearch from 'server/HAFAS/LocMatch';
import DS100 from 'server/Search/DS100';
import FavendoSearch from './Favendo';
import OpenDataOfflineSearch from './OpenDataOffline';
import OpenDataSearch from './OpenData';
import StationsDataSearch from './StationsData';

const defaultSearch = canUseBusinessHub ? BusinessHubSearch : FavendoSearch;

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

export default async (
  rawSearchTerm: string,
  type?: StationSearchType,
  maxStations: number = 6
) => {
  const searchTerm = rawSearchTerm.replace(/ {2}/g, ' ');

  const ds100Search = DS100(searchTerm);

  try {
    let result = await getSearchMethod(type)(searchTerm);

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
