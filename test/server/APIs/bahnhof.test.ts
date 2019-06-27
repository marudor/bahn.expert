import { checkApi, mockWithFile } from './helper';
import { versions } from 'server/APIs/bahnhof';
jest.mock('node-cache');

describe('Bahnhof API', () => {
  versions.forEach(v => {
    describe(v, () => {
      it('/lageplan', async () => {
        mockWithFile(
          'https://www.bahnhof.de',
          '/service/search/bahnhof-de/520608?query=Hamburg%20Hbf',
          'bahnhof/search'
        );
        mockWithFile(
          'https://www.bahnhof.de',
          '/bahnhof-de/bahnhof/Hamburg_Hbf-1030112',
          'bahnhof/hamburg hbf'
        );
        await checkApi(`/api/bahnhof/${v}/lageplan/Hamburg Hbf`);
      });
    });
  });
});
