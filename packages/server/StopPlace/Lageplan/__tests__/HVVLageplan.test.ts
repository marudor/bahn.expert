import { getHVVLageplan } from 'server/StopPlace/Lageplan/HVVLageplan';
import Nock from 'nock';

describe('HVV Lageplan', () => {
  beforeAll(() => {
    Nock.enableNetConnect('geofox.hvv.de');
  });

  afterAll(() => {
    Nock.disableNetConnect();
  });
  // TODO: fix with mock
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('Kiel-Elmschenhagen, 8003477', async () => {
    const lageplan = await getHVVLageplan('8003477');
    expect(lageplan).toBe(
      'https://geofox.hvv.de/images/mobi/pdf/Kiel-Elmschenhagen.pdf',
    );
  });
});
