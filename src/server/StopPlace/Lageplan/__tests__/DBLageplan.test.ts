/* eslint no-sync: 0 */
import {
  getCachedDBLageplan,
  getDBLageplan,
} from 'server/StopPlace/Lageplan/DBLageplan';
import fs from 'fs';
import Nock from 'nock';
import path from 'path';

describe('Lageplan', () => {
  const nock = Nock('https://www.bahnhof.de');

  function readFixutre(f: string) {
    return fs.readFileSync(path.resolve(__dirname, '__fixtures__/', f));
  }
  it('first time cached is undefined', async () => {
    expect(await getCachedDBLageplan('Hamburg Hbf')).toBeUndefined();
  });

  describe('Example without Lageplan', () => {
    it('is undefined if non existant', async () => {
      nock
        .get('/service/search/bahnhof-de/3464932')
        .query({
          query: 'Langenfelde',
        })
        .reply(200, readFixutre('LangenfeldeSearch.html'));

      nock
        .get('/bahnhof-de/bahnhof/Langenfelde-1025344')
        .reply(200, readFixutre('Langenfelde.html'));
      await expect(getDBLageplan('Langenfelde')).resolves.toBeUndefined();
    });

    it('cache resolves', async () => {
      await expect(getDBLageplan('Langenfelde')).resolves.toBeUndefined();
    });

    it('is undefined if html has no result', async () => {
      nock
        .get('/service/search/bahnhof-de/3464932')
        .query({
          query: 'Langenfeld',
        })
        .reply(200, readFixutre('LangenfeldeSearchMissing.html'));

      await expect(getDBLageplan('Langenfeld')).resolves.toBeUndefined();
    });
  });

  describe('Example with Lageplan', () => {
    it('is null if non existant', async () => {
      nock
        .get('/service/search/bahnhof-de/3464932')
        .query({
          query: 'Hamburg Hbf',
        })
        .reply(200, readFixutre('HamburgHbfSearch.html'));

      nock
        .get('/bahnhof-de/bahnhof/Hamburg_Hbf-1030112')
        .reply(200, readFixutre('HamburgHbf.html'));
      await expect(getDBLageplan('Hamburg Hbf')).resolves.toBe(
        'https://www.bahnhof.de/resource/blob/1029874/4869d8dea83b386b0bb773ec64ddb021/Hamburg-Hbf_locationPdf-data.pdf',
      );
    });

    it('cache resolves', async () => {
      await expect(getDBLageplan('Hamburg Hbf')).resolves.toBe(
        'https://www.bahnhof.de/resource/blob/1029874/4869d8dea83b386b0bb773ec64ddb021/Hamburg-Hbf_locationPdf-data.pdf',
      );
    });
  });
});
