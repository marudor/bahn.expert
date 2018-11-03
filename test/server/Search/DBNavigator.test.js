// @flow
import { testHamburgSearch } from './common';
import DBNavSearch from 'server/Search/DBNavigator';
import exampleRespone from './__fixtures__/DBNavigator.example';
import Nock from 'nock';

describe('DBNavigator Search', () => {
  it('Returns correct mapping', async () => {
    Nock('https://reiseauskunft.bahn.de')
      .post('/bin/mgate.exe')
      .query(true)
      .reply(200, exampleRespone);

    await testHamburgSearch(DBNavSearch);
  });

  it('Throws exception on error', async () => {
    await expect(DBNavSearch('Hamburg')).rejects.toBeTruthy();
  });
});
