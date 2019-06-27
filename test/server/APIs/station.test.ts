import { checkApi, mockWithFile } from './helper';
import { versions } from 'server/APIs/station';
jest.mock('node-cache');

describe('Station API', () => {
  versions.forEach(v => {
    describe(v, () => {
      it('/search favendo', async () => {
        mockWithFile(
          'https://si.favendo.de',
          '/station-info/rest/api/search?searchTerm=Hamburg+Hbf',
          'station/favendo'
        );
        await checkApi(`/api/station/${v}/search/Hamburg Hbf?type=1`);
      });
      it('/search openData', async () => {
        mockWithFile(
          'https://api.deutschebahn.com',
          '/stada/v2/stations?searchstring=*Hamburg*Hbf*',
          'station/opendata'
        );
        await checkApi(`/api/station/${v}/search/Hamburg Hbf?type=3`);
      });
      it('/search openData offline', async () => {
        await checkApi(`/api/station/${v}/search/Hamburg Hbf?type=4`);
      });
      it('/iris', async () => {
        mockWithFile(
          'https://iris.noncd.db.de',
          '/iris-tts/timetable/station/8002549',
          'station/iris/1'
        );
        mockWithFile(
          'https://iris.noncd.db.de',
          '/iris-tts/timetable/station/8071065',
          'station/iris/2'
        );
        mockWithFile(
          'https://iris.noncd.db.de',
          '/iris-tts/timetable/station/8071066',
          'station/iris/3'
        );
        mockWithFile(
          'https://iris.noncd.db.de',
          '/iris-tts/timetable/station/8076116',
          'station/iris/4'
        );
        mockWithFile(
          'https://iris.noncd.db.de',
          '/iris-tts/timetable/station/8098549',
          'station/iris/5'
        );
        await checkApi(`/api/station/${v}/iris/8002549`);
      });
    });
  });
});
