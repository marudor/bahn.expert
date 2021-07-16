import { getHVVLageplan } from 'server/StopPlace/Lageplan/HVVLageplan';
import Nock from 'nock';

describe('HVV Lageplan', () => {
  beforeAll(() => {
    Nock.enableNetConnect('geofox.hvv.de');
  });

  afterAll(() => {
    Nock.disableNetConnect();
  });
  it('Kiel-Elmschenhagen, 8003477', async () => {
    const lageplan = await getHVVLageplan('8003477');
    expect(lageplan).toBe(
      'https://geofox.hvv.de/images/mobi/pdf/Kiel-Elmschenhagen.pdf',
    );
  });
});
