import { createTestServer } from 'server/testHelper';
import { promises as fs } from 'fs';
import Nock from 'nock';
import path from 'path';
import request from 'supertest';
import type { Formation } from 'types/reihung';

describe('Reihung V2', () => {
  const nock = Nock('https://www.apps-bahn.de');
  const loadFixture = (fileName: string) =>
    fs.readFile(path.resolve(__dirname, '__fixtures__/', fileName), 'utf8');
  const server = createTestServer();

  it('Get ICE1 Reihung', async () => {
    nock
      .get('/wr/wagenreihung/1.0/373/201911221650')
      .reply(200, await loadFixture('ICE1.json'));

    return request(server)
      .get('/api/reihung/v2/wagen/373/2019-11-22T15:50:00.000Z')
      .expect(({ status, body }: { status: number; body: Formation }) => {
        expect(status).toBe(200);
        expect(body.allFahrzeuggruppe).toHaveLength(1);
        const fahrzeuge = body.allFahrzeuggruppe[0].allFahrzeug;

        expect(fahrzeuge).toHaveLength(14);
        const W11 = fahrzeuge.find((f) => f.wagenordnungsnummer === '11');
        const W9 = fahrzeuge.find((f) => f.wagenordnungsnummer === '9');
        const W7 = fahrzeuge.find((f) => f.wagenordnungsnummer === '7');

        if (!W11 || !W9 || !W7) throw new Error('Missing Waggon');

        expect(W11.kategorie).toBe('REISEZUGWAGENERSTEKLASSE');
        expect(W11.fahrzeugtyp).toBe('Avmz');
        expect(W11.additionalInfo).toEqual({
          klasse: 1,
          icons: {},
          comfort: true,
          comfortSeats: expect.stringContaining(''),
        });
        expect(W9.kategorie).toBe('REISEZUGWAGENERSTEKLASSE');
        expect(W9.additionalInfo).toEqual({
          klasse: 1,
          icons: {
            info: true,
            toddler: true,
            wheelchair: true,
            disabled: true,
          },
          disabledSeats: expect.stringContaining(''),
        });
        expect(W7.additionalInfo).toEqual({
          klasse: 2,
          icons: {
            disabled: true,
          },
          comfort: true,
          disabledSeats: expect.stringContaining(''),
          comfortSeats: expect.stringContaining(''),
        });
      });
  });
});
