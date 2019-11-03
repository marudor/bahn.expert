import { createTestServer } from 'testHelper';
import { Server } from 'http';
import Nock from 'nock';
import request from 'supertest';

jest.mock('node-cache');
describe('Bahnhof V1', () => {
  const nock = Nock('https://www.bahnhof.de');
  let server: Server;

  beforeAll(async () => {
    server = await createTestServer();
  });

  it('Gets Lageplan by stationName', () => {
    nock
      .get('/service/search/bahnhof-de/520608')
      .query({
        query: 'Hamburg',
      })
      .reply(200, '');

    return request(server)
      .get('/api/bahnhof/v1/lageplan/Hamburg')
      .expect(200);
  });
});
