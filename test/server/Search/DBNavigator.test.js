// @flow
import { testHamburgSearch } from './common';
import DBNavigatorSearch from 'server/Search/DBNavigator';
import exampleRespone from './__fixtures__/DBNavigator.example';
import Nock from 'nock';

describe('DBNavigator Search', () => {
  it('Returns correct mapping', async () => {
    Nock('https://reiseauskunft.bahn.de')
      .post('/bin/mgate.exe')
      .query(true)
      .reply(200, exampleRespone);

    await testHamburgSearch(DBNavigatorSearch);
  });

  it('Throws exception on error', async () => {
    await expect(DBNavigatorSearch('Hamburg')).rejects.toBeTruthy();
  });
});
