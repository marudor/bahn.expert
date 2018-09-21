// @flow
import { flatten, uniqBy } from 'lodash';
import DBNavigatorSearch from './DBNavigator';
import FavendoSearch from './Favendo';
import HafasSearch from './Hafas';
import OpenDataOfflineSearch from './OpenDataOffline';
import OpenDataSearch from './OpenData';
import OpenDBSearch from './OpenDB';

async function favendoOpenDBCombined(searchTerm: string) {
  const stations = await Promise.all([FavendoSearch(searchTerm), OpenDBSearch(searchTerm)]);

  return uniqBy(flatten(stations), 'id');
}

export default (searchTerm: string, type: ?string) => {
  switch (type) {
    case 'dbNav':
      return DBNavigatorSearch(searchTerm);
    case 'openData':
      return OpenDataSearch(searchTerm);
    case 'openDataOffline':
      return OpenDataOfflineSearch(searchTerm);
    case 'openDB':
      return OpenDBSearch(searchTerm);
    case 'hafas':
      return HafasSearch(searchTerm);
    case 'favOpenDB':
      return favendoOpenDBCombined(searchTerm);
    case 'favendo':
    default:
      return FavendoSearch(searchTerm);
  }
};
