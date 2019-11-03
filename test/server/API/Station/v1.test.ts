import { createTestServer } from 'testHelper';
import { Server } from 'http';
import Nock from 'nock';
import request from 'supertest';

jest.mock('node-cache');
describe('Station V1', () => {
  let server: Server;

  beforeAll(async () => {
    server = await createTestServer();
  });

  describe('/search', () => {
    it('no Type goes to default', () => {
      Nock('https://si.favendo.de')
        .get('/station-info/rest/api/search?searchTerm=Hamburg')
        .reply(200, []);

      return request(server)
        .get('/api/station/v1/search/Hamburg')
        .expect(200);
    });

    it('invalid Type goes to default', () => {
      Nock('https://si.favendo.de')
        .get('/station-info/rest/api/search?searchTerm=Hamburg')
        .reply(200, []);

      return request(server)
        .get('/api/station/v1/search/Hamburg?type=invalid')
        .expect(200);
    });

    it('favendo Type', () => {
      Nock('https://si.favendo.de')
        .get('/station-info/rest/api/search?searchTerm=Hamburg')
        .reply(200, [
          {
            title: 'test',
            eva_ids: [42],
          },
        ]);

      return request(server)
        .get('/api/station/v1/search/Hamburg?type=favendo')
        .expect(200, [
          {
            title: 'test',
            id: 42,
          },
        ]);
    });

    it('hafas Type', () => {
      Nock('https://reiseauskunft.bahn.de')
        .post('/bin/mgate.exe?checksum=0adadd3ba832b46f9c451c1f5e8e5d36')
        .reply(200, {
          err: 'OK',
          svcResL: [
            {
              err: 'OK',
              res: {
                common: {
                  prodL: [],
                  locL: [],
                },
                match: {
                  locL: [
                    {
                      extId: 42,
                      name: 'test',
                    },
                  ],
                },
              },
            },
          ],
        });

      return request(server)
        .get('/api/station/v1/search/Hamburg?type=hafas')
        .expect(200, [
          {
            id: 42,
            title: 'test',
          },
        ]);
    });

    it('openData Type', () => {
      Nock('https://api.deutschebahn.com')
        .get('/stada/v2/stations?searchstring=*Hamburg*')
        .reply(200, {
          result: [
            {
              name: 'test',
              evaNumbers: [{ number: 42 }],
              ril100Identifiers: [],
            },
          ],
        });

      return request(server)
        .get('/api/station/v1/search/Hamburg?type=openData')
        .expect(200, [
          {
            id: '42',
            title: 'test',
          },
        ]);
    });

    it('openDataOffline Type', () => {
      return request(server)
        .get('/api/station/v1/search/Hamburg?type=openDataOffline')
        .expect(200);
    });

    it('stationsdata Type', () => {
      return request(server)
        .get('/api/station/v1/search/Hamburg?type=stationsData')
        .expect(200);
    });

    it('favendoStationsData Type', () => {
      Nock('https://si.favendo.de')
        .get('/station-info/rest/api/search?searchTerm=Hamburg')
        .reply(200, []);

      return request(server)
        .get('/api/station/v1/search/Hamburg?type=favendoStationsData')
        .expect(200);
    });
  });

  describe('/geoSearch', () => {
    it('lat is required', () =>
      request(server)
        .get('/api/station/v1/geoSearch')
        .expect(res => {
          expect(res.status).toBe(400);
          expect(res.body.fields.lat).toBeDefined();
        }));

    it('lng is required', () =>
      request(server)
        .get('/api/station/v1/geoSearch')
        .expect(res => {
          expect(res.status).toBe(400);
          expect(res.body.fields.lng).toBeDefined();
        }));

    it('searchText is not required', () =>
      request(server)
        .get('/api/station/v1/geoSearch')
        .expect(res => {
          expect(res.status).toBe(400);
          expect(res.body.fields.searchText).not.toBeDefined();
        }));

    it('sends Request', () => {
      Nock('https://si.favendo.de')
        .get('/station-info/rest/api/search')
        .query({
          lat: 23.4,
          lng: 42.3,
          searchTerm: '',
        })
        .reply(200, []);

      return request(server)
        .get('/api/station/v1/geoSearch')
        .query({
          lat: 23.4,
          lng: 42.3,
        })
        .expect(200, []);
    });

    it('sends Request with searchTerm', () => {
      Nock('https://si.favendo.de')
        .get('/station-info/rest/api/search')
        .query({
          lat: 23.4,
          lng: 42.3,
          searchTerm: 'Hamburg',
        })
        .reply(200, []);

      return request(server)
        .get('/api/station/v1/geoSearch')
        .query({
          lat: 23.4,
          lng: 42.3,
          searchText: 'Hamburg',
        })
        .expect(200, []);
    });
  });

  describe('/iris', () => {
    it('404 if no result', () => {
      Nock('https://iris.noncd.db.de')
        .get('/iris-tts/timetable/station/42')
        .reply(200, '<stations></stations>');

      return request(server)
        .get('/api/station/v1/iris/42')
        .expect(404);
    });

    it('200 with result', () => {
      Nock('https://iris.noncd.db.de')
        .get('/iris-tts/timetable/station/42')
        .reply(
          200,
          '<stations><station meta="" name="test" eva="42"/></stations>'
        );

      return request(server)
        .get('/api/station/v1/iris/42')
        .expect(200, {
          station: {
            meta: [],
            name: 'test',
            eva: '42',
          },
          relatedStations: [],
        });
    });
  });
});
