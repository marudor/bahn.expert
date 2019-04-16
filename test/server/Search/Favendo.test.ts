import { StationSearchType } from 'Common/config';
import { testHamburgSearch } from './common';
import exampleOpenDBRespone from './__fixtures__/OpenDB-forCombine.example';
import exampleRespone from './__fixtures__/Favendo.example';
import FavendoSearch from 'server/Search/Favendo';
import Nock from 'nock';
import serverSearch, { favendoOpenDBCombined } from 'server/Search';

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

  it('Correct combined Favendo & openDB', async () => {
    Nock('https://si.favendo.de')
      .get('/station-info/rest/api/search')
      .query({
        searchTerm: 'Hamburg',
      })
      .reply(200, exampleRespone);

    Nock('https://open-api.bahn.de')
      .get('/bin/rest.exe/location.name')
      .query(q => {
        expect(q.input).toBe('Hamburg');
        expect(q.format).toBe('json');

        return true;
      })
      .reply(200, exampleOpenDBRespone);

    const result = await favendoOpenDBCombined('Hamburg');

    expect(result.map(r => r.title)).toEqual([
      'Hamburg Hbf',
      'Hamburg Dammtor',
      'Hamburg Dammtor-test',
    ]);
  });

  it('Throws instead of fallback to default', async () => {
    await expect(
      serverSearch('Hamburg', StationSearchType.Favendo)
    ).rejects.toBeTruthy();
    await expect(serverSearch('Hamburg')).rejects.toBeTruthy();
  });

  it('Throws exception on error', async () => {
    await expect(FavendoSearch('Hamburg')).rejects.toBeTruthy();
  });
});
