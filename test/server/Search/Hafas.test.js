// @flow
import { testHamburgSearch } from './common';
import exampleRespone from './__fixtures__/Hafas.example';
import HafasSearch from 'server/Search/Hafas';
import Nock from 'nock';

describe('Hafas Search', () => {
  it('Returns correct mapping', async () => {
    Nock('http://reiseauskunft.bahn.de')
      .get('/bin/ajax-getstop.exe/dn')
      .query({
        S: 'Hamburg*',
      })
      .reply(200, exampleRespone);

    await testHamburgSearch(HafasSearch);
  });

  it('Throws exception on error', async () => {
    await expect(HafasSearch('Hamburg')).rejects.toBeTruthy();
  });
});
