import { createTestServer } from 'server/testHelper';
import Nock from 'nock';
import path from 'path';
import request from 'supertest';

describe('Hafas V2', () => {
  const nock = Nock('https://reiseauskunft.bahn.de');
  const server = createTestServer();

  describe('/journeyDetails', () => {
    it('Parses JourneyDetails result', () => {
      nock
        .post('/bin/mgate.exe')
        .query({
          checksum: 'e7152163831a365b30238e4edbb09423',
        })
        .replyWithFile(
          200,
          path.resolve(
            __dirname,
            '__fixtures__/journeyDetails/1|295600|0|80|10122019',
          ),
        );

      return request(server)
        .get('/api/hafas/v2/journeyDetails?jid=1|295600|0|80|10122019')
        .expect((res) => {
          expect(res.body).toMatchSnapshot();
        })
        .expect(200);
    });

    it('jid is required', () => {
      return request(server)
        .get('/api/hafas/v2/journeyDetails')
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
