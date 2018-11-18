// @flow
import { flatten, uniqBy } from 'lodash';
import { logger } from 'server/logger';
import DBNavigatorSearch from './DBNavigator';
import FavendoSearch from './Favendo';
import HafasSearch from './Hafas';
import OpenDataOfflineSearch from './OpenDataOffline';
import OpenDataSearch from './OpenData';
import OpenDBSearch from './OpenDB';
import type { Station } from 'types/abfahrten';

export async function favendoOpenDBCombined(searchTerm: string): Promise<Station[]> {
  const stations = await Promise.all([FavendoSearch(searchTerm), OpenDBSearch(searchTerm)]);

  return uniqBy(flatten(stations), 'id');
}

export function getSearchMethod(type: ?string) {
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
    case 'favendo':
    default:
      return FavendoSearch;
  }
}

export default async (searchTerm: string, type: ?string) => {
  try {
    return await getSearchMethod(type)(searchTerm);
  } catch (e) {
    logger.error('search failed, falling back to default', {
      searchMethod: type,
      error: {
        statusText: e.response?.statusText,
        data: e.response?.data,
        status: e.response?.status,
      },
    });

    return getSearchMethod('favendo')(searchTerm);
  }
};
