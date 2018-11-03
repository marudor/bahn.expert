// @ƒlow
import { favendoOpenDBCombined, getSearchMethod } from 'server/Search';
import DBNavigatorSearch from 'server/Search/DBNavigator';
import FavendoSearch from 'server/Search/Favendo';
import HafasSearch from 'server/Search/Hafas';
import OpenDataOfflineSearch from 'server/Search/OpenDataOffline';
import OpenDataSearch from 'server/Search/OpenData';
import OpenDBSearch from 'server/Search/OpenDB';

const typeDict = {
  dbNav: DBNavigatorSearch,
  openData: OpenDataSearch,
  openDataOffline: OpenDataOfflineSearch,
  openDB: OpenDBSearch,
  hafas: HafasSearch,
  favOpenDB: favendoOpenDBCombined,
  favendo: FavendoSearch,
  invalid: FavendoSearch,
};

describe('Search', () => {
  // eslint-disable-next-line guard-for-in
  for (const type in typeDict) {
    it(`${type} matches Function`, () => {
      expect(getSearchMethod(type)).toBe(typeDict[type]);
    });
  }
});
