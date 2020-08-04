/* eslint-disable jest/expect-expect */
import { createTestServer } from 'server/testHelper';
import Nock from 'nock';
import request from 'supertest';

describe('Bahnhof V1', () => {
  const nock = Nock('https://www.bahnhof.de');
  const server = createTestServer();

  it('Gets Lageplan by stationName', () => {
    nock
      .get('/service/search/bahnhof-de/520608')
      .query({
        query: 'Hamburg',
      })
      .reply(200, '');

    return request(server)
      .get('/api/bahnhof/v1/lageplan/Hamburg/8002549')
      .expect(200);
  });
});
