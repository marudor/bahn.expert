import { createTestServer } from 'server/testHelper';
import Nock from 'nock';
import path from 'path';
import request from 'supertest';

describe('Hafas V1', () => {
  const nock = Nock('https://reiseauskunft.bahn.de');
  const server = createTestServer();

  describe('/journeyDetails', () => {
    it('Parses JourneyDetails result', () => {
      nock
        .post('/bin/mgate.exe')
        .query({
          checksum: '582e13bcf42934dcc3ed5256e1485ffa',
        })
        .replyWithFile(
          200,
          path.resolve(
            __dirname,
            '__fixtures__/journeyDetails/1|295600|0|80|10122019'
          )
        );

      return request(server)
        .get('/api/hafas/v1/journeyDetails?jid=1|295600|0|80|10122019')
        .expect((res) => {
          expect(res.body).toMatchSnapshot();
        })
        .expect(200);
    });

    it('jid is required', () => {
      return request(server)
        .get('/api/hafas/v1/journeyDetails')
        .expect(400)
        .expect((res) => {
          expect(res.body).toMatchObject({
            fields: {
              jid: {
                message: "'jid' is required",
              },
            },
          });
        });
    });
  });
});
