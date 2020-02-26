/* eslint-disable jest/expect-expect */
import { testHamburgSearch } from './common';
import exampleRespone from './__fixtures__/Favendo.example';
import FavendoSearch from 'server/Search/Favendo';
import Nock from 'nock';

describe('Favendo Search', () => {
  it('Returns correct mapping', async () => {
    Nock('https://si.favendo.de')
      .get('/station-info/rest/api/search')
      .query({
        searchTerm: 'Hamburg',
      })
      .reply(200, exampleRespone);

    await testHamburgSearch(FavendoSearch, {
      includeFavendoId: true,
    });
  });

  it('Throws exception on error', async () => {
    await expect(FavendoSearch('Hamburg')).toReject();
  });
});
