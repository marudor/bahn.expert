import { createTestServer } from 'server/testHelper';
import Nock from 'nock';
import path from 'path';
import request from 'supertest';

describe('Hafas Details Redirect', () => {
  const nock = Nock('https://reiseauskunft.bahn.de');
  const server = createTestServer();

  it('1|334364|0|80|25102021', async () => {
    nock
      .post('/bin/mgate.exe')
      .query({
        checksum: '275ef414b005d0cd8c2ffe02c8d3dc1d',
      })
      .replyWithFile(
        200,
        path.resolve(
          __dirname,
          '__fixtures__/journeyDetails/1|334364|0|80|25102021',
        ),
      );

    await request(server)
      .get('/api/hafas/v1/detailsRedirect/1|334364|0|80|25102021')
      .expect(302)
      .expect((res) => {
        expect(res.headers.location).toBe(
          '/details/ICE 72/2021-10-25T10:37:00.000Z?stopEva=8509000',
        );
      });
  });
});
