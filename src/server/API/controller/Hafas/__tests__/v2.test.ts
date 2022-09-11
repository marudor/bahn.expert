/* eslint-disable unicorn/prefer-module */
import { createTestServer } from 'server/testHelper';
import Nock from 'nock';
import path from 'node:path';
import request from 'supertest';

describe('Hafas V2', () => {
  const nock = Nock('https://reiseauskunft.bahn.de');
  const server = createTestServer();

  describe('/journeyDetails', () => {
    it('Parses JourneyDetails result', () => {
      nock
        .post('/bin/mgate.exe')
        .query({
          checksum: 'e9a84c4b2e75c45a5e104001fccce14f',
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
