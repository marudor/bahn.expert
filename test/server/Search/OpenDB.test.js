// @flow
import { testHamburgSearch } from './common';
import exampleFavendoRespone from './__fixtures__/Favendo.example';
import exampleRespone from './__fixtures__/OpenDB.example';
import exampleSingleRespone from './__fixtures__/OpenDB-single.example';
import Nock from 'nock';
import OpenDBSearch from 'server/Search/OpenDB';
import serverSearch from 'server/Search';

describe('OpenDB Search', () => {
  it('Returns correct mapping', async () => {
    Nock('https://open-api.bahn.de')
      .get('/bin/rest.exe/location.name')
      .query(q => {
        expect(q.input).toBe('Hamburg');
        expect(q.format).toBe('json');

        return true;
      })
      .reply(200, exampleRespone);

    await testHamburgSearch(OpenDBSearch);
  });

  it('Should use only one letter for 2 letter inputs (for some weird reason', async () => {
    Nock('https://open-api.bahn.de')
      .get('/bin/rest.exe/location.name')
      .query(q => {
        expect(q.input).toBe('H');

        return true;
      })
      .reply(200, exampleRespone);

    await OpenDBSearch('Ha');
  });

  it('Should handle single result results', async () => {
    Nock('https://open-api.bahn.de')
      .get('/bin/rest.exe/location.name')
      .query(true)
      .reply(200, exampleSingleRespone);

    const result = await OpenDBSearch('Ha');

    expect(result).toEqual([{ id: '8002549', title: 'Hamburg Hbf' }]);
  });

  it('Fallback to Favendo if initial failed', async () => {
    Nock('https://open-api.bahn.de')
      .get('/bin/rest.exe/location.name')
      .query(true)
      .reply(500);

    Nock('https://si.favendo.de')
      .get('/station-info/rest/api/search')
      .query({
        searchTerm: 'Hamburg',
      })
      .reply(200, exampleFavendoRespone);

    await testHamburgSearch(term => serverSearch(term, 'openDB'), {
      includeFavendoId: true,
    });
  });

  it('Throws exception on error', async () => {
    await expect(OpenDBSearch('Hamburg')).rejects.toBeTruthy();
  });
});
