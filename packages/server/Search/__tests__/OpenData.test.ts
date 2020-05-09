import { testHamburgSearch } from './common';
import exampleRespone from './__fixtures__/OpenData.example';
import Nock from 'nock';
import OpenDataSearch from 'server/Search/OpenData';

describe('DBNavigator Search', () => {
  it('Returns correct mapping', async () => {
    Nock('https://api.deutschebahn.com')
      .get('/stada/v2/stations')
      .query({
        searchstring: '*Hamburg*',
      })
      .reply(200, exampleRespone);

    await expect(
      testHamburgSearch(OpenDataSearch, {
        includeDS100: true,
        includeFavendoId: true,
      })
    ).resolves.toBeUndefined();
  });

  it('Should use only one letter for 2 letter inputs (for some weird reason', async () => {
    Nock('https://api.deutschebahn.com')
      .get('/stada/v2/stations')
      .query({
        searchstring: '*H*',
      })
      .reply(200, exampleRespone);

    await expect(OpenDataSearch('Ha')).resolves.toBeTruthy();
  });

  it('Throws exception on error', async () => {
    await expect(OpenDataSearch('Hamburg')).rejects.toBeTruthy();
  });
});
