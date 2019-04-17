/* eslint no-sync: 0 */
import { cache, getCachedLageplan, getLageplan } from 'server/Bahnhof/Lageplan';
import fs from 'fs';
import Nock from 'nock';
import path from 'path';

describe('Lageplan', () => {
  const nock = Nock('https://www.bahnhof.de');

  function readFixutre(f: string) {
    return fs.readFileSync(path.resolve(__dirname, '__fixtures__/', f));
  }
  afterAll(() => {
    cache.flushAll();
  });

  it('first time cached is undefined', () => {
    expect(getCachedLageplan('Hamburg Hbf')).toBeUndefined();
  });

  describe('Example without Lageplan', () => {
    afterAll(() => {
      cache.flushAll();
    });
    it('is null if non existant', async () => {
      nock
        .get('/service/search/bahnhof-de/520608')
        .query({
          query: 'Langenfelde',
        })
        .reply(200, readFixutre('LangenfeldeSearch.html'));

      nock
        .get('/bahnhof-de/bahnhof/Langenfelde-1025344')
        .reply(200, readFixutre('Langenfelde.html'));
      await expect(getLageplan('Langenfelde')).resolves.toBeNull();
    });

    it('cache resolves', async () => {
      await expect(getLageplan('Langenfelde')).resolves.toBeNull();
    });
  });

  describe('Example with Lageplan', () => {
    afterAll(() => {
      cache.flushAll();
    });
    it('is null if non existant', async () => {
      nock
        .get('/service/search/bahnhof-de/520608')
        .query({
          query: 'Hamburg Hbf',
        })
        .reply(200, readFixutre('HamburgHbfSearch.html'));

      nock
        .get('/bahnhof-de/bahnhof/Hamburg_Hbf-1030112')
        .reply(200, readFixutre('HamburgHbf.html'));
      await expect(getLageplan('Hamburg Hbf')).resolves.toBe(
        'https://www.bahnhof.de/resource/blob/1029874/4869d8dea83b386b0bb773ec64ddb021/Hamburg-Hbf_locationPdf-data.pdf'
      );
    });

    it('cache resolves', async () => {
      await expect(getLageplan('Hamburg Hbf')).resolves.toBe(
        'https://www.bahnhof.de/resource/blob/1029874/4869d8dea83b386b0bb773ec64ddb021/Hamburg-Hbf_locationPdf-data.pdf'
      );
    });
  });
});
