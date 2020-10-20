import { getNAHSHLageplan } from 'server/Bahnhof/NAHSHLageplan';
import Nock from 'nock';

describe('HVV Lageplan', () => {
  beforeAll(() => {
    Nock.enableNetConnect();
  });

  afterAll(() => {
    Nock.disableNetConnect();
  });
  it('Flensburg, 8000103', async () => {
    const lageplan = await getNAHSHLageplan('8000103');
    expect(lageplan).toBe(
      'https://www.nah.sh/assets/downloads/Stationsplaene/Flensburg.pdf',
    );
  });

  it('Neumünster Süd AKN, 8007062', async () => {
    const lageplan = await getNAHSHLageplan('8007062');
    expect(lageplan).toBe(
      'https://www.nah.sh/assets/downloads/Stationsplaene/Neumuenster_Sued.pdf',
    );
  });
});
