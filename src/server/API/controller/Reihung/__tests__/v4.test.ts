/* eslint-disable unicorn/prefer-module */
import { createTestServer } from '@/server/testHelper';
import { promises as fs } from 'node:fs';
import Nock from 'nock';
import path from 'node:path';
import request from 'supertest';
import type { CoachSequenceInformation } from '@/types/coachSequence';

const loadFixture = (fileName: string) =>
  fs.readFile(path.resolve(__dirname, '__fixtures__/', fileName), 'utf8');

describe('Reihung V4', () => {
  const nock = Nock('https://ist-wr.noncd.db.de');

  const server = createTestServer();

  it('Get ICE1 Reihung', async () => {
    nock
      .get('/wagenreihung/1.0/373/201911221650')
      .reply(200, await loadFixture('ICE1.json'));

    return request(server)
      .get('/api/reihung/v4/wagen/373?departure=2019-11-22T15:50:00.000Z')
      .expect(
        ({
          status,
          body,
        }: {
          status: number;
          body: CoachSequenceInformation;
        }) => {
          expect(status).toBe(200);
          expect(body.sequence.groups).toHaveLength(1);
          const coaches = body.sequence.groups[0].coaches;

          expect(coaches).toHaveLength(14);
          const W11 = coaches.find((c) => c.identificationNumber === '11');
          const W9 = coaches.find((c) => c.identificationNumber === '9');
          const W7 = coaches.find((c) => c.identificationNumber === '7');

          if (!W11 || !W9 || !W7) throw new Error('Missing Waggon');

          expect(W11.vehicleCategory).toBe('PASSENGERCARRIAGE_FIRST_CLASS');
          expect(W11.type).toBe('Avmz');
          expect(W11.class).toBe(1);
          expect(W11.features).toEqual({
            comfort: true,
          });
          expect(W11.seats?.comfort).toEqual(expect.stringContaining(''));

          expect(W9.vehicleCategory).toBe('PASSENGERCARRIAGE_FIRST_CLASS');
          expect(W9.class).toBe(1);
          expect(W9.features).toEqual({
            info: true,
            toddler: true,
            wheelchair: true,
            disabled: true,
          });
          expect(W9.seats?.disabled).toEqual(expect.stringContaining(''));

          expect(W7.class).toBe(2);
          expect(W7.features).toEqual({
            disabled: true,
            comfort: true,
          });
          expect(W7.seats).toEqual({
            disabled: expect.stringContaining(''),
            comfort: expect.stringContaining(''),
          });
        },
      );
  });
});
