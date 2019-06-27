import { checkApi, mockWithFile } from './helper';
import { versions } from 'server/APIs/reihung';
jest.mock('node-cache');

describe('Reihungs API', () => {
  versions.forEach(v => {
    describe(v, () => {
      it('/wagen', async () => {
        mockWithFile(
          'https://www.apps-bahn.de',
          '/wr/wagenreihung/1.0/1653/201906271520',
          'reihung/wagen'
        );
        await checkApi(`/api/reihung/${v}/wagen/1653/1561641600000`);
      });
    });
  });
});
