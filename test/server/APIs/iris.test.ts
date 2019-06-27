import { checkApi, mockWithFile } from './helper';
import { versions } from 'server/APIs/iris';
jest.mock('node-cache');

describe('IRIS API', () => {
  versions.forEach(v => {
    describe(v, () => {
      it('/abfahrten', async () => {
        mockWithFile(
          'https://iris.noncd.db.de',
          '/iris-tts/timetable/station/8098105',
          'iris/station/8098105',
          'get',
          3
        );
        mockWithFile(
          'https://iris.noncd.db.de',
          '/iris-tts/timetable/station/8000105',
          'iris/station/8000105',
          'get',
          3
        );
        mockWithFile(
          'https://iris.noncd.db.de',
          '/iris-tts/timetable/station/8089211',
          'iris/station/8089211',
          'get',
          3
        );
        mockWithFile(
          'https://iris.noncd.db.de',
          '/iris-tts/timetable/fchg/8098105',
          'iris/fchg/8098105'
        );
        mockWithFile(
          'https://iris.noncd.db.de',
          '/iris-tts/timetable/fchg/8000105',
          'iris/fchg/8000105'
        );
        mockWithFile(
          'https://iris.noncd.db.de',
          '/iris-tts/timetable/fchg/8089211',
          'iris/fchg/8089211'
        );
        mockWithFile(
          'https://www.bahnhof.de',
          '/service/search/bahnhof-de/520608?query=Frankfurt%20Hbf%20%20%28tief%29',
          'iris/bahnhof/frankfurt hbf tief'
        );
        mockWithFile(
          'https://www.bahnhof.de',
          '/service/search/bahnhof-de/520608?query=Frankfurt%20%28Main%29%20Hbf',
          'iris/bahnhof/frankfurt main hbf'
        );
        mockWithFile(
          'https://www.bahnhof.de',
          '/service/search/bahnhof-de/520608?query=Frankfurt%20%28M%29%20Hbf%20Stuttgarter%20Str.',
          'iris/bahnhof/frankfurt hbf stuttgarter str'
        );
        mockWithFile(
          'https://www.bahnhof.de',
          '/resource/blob/511998/2f507148493375276b906a182e429fbc/Zukunft-Bahn-DB-Station-Service-AG-data.pdf',
          'iris/bahnhof/zukunftdb.pdf'
        );
        mockWithFile(
          'https://www.bahnhof.de',
          '/bahnhof-de/bahnhof/Frankfurt__Main__Hbf-1038974',
          'iris/bahnhof/frankfurt main hbf result'
        );

        [15, 16, 17].forEach(time => {
          mockWithFile(
            'https://iris.noncd.db.de',
            `/iris-tts/timetable/plan/8098105/190627/${time}`,
            `iris/plan/8098105/${time}`
          );
          mockWithFile(
            'https://iris.noncd.db.de',
            `/iris-tts/timetable/plan/8000105/190627/${time}`,
            `iris/plan/8000105/${time}`
          );
          mockWithFile(
            'https://iris.noncd.db.de',
            `/iris-tts/timetable/plan/8089211/190627/${time}`,
            `iris/plan/8089211/${time}`
          );
        });

        await checkApi(
          `/api/iris/${v}/abfahrten/8098105?lookbehind=30&lookahead=30`
        );
      });
      it('/wings', async () => {
        mockWithFile(
          'https://iris.noncd.db.de',
          `/iris-tts/timetable/wingdef/5090299178847069383-1906271825-1/-688384725346268286-1906271825-1`,
          `iris/wingdef`
        );
        await checkApi(
          `/api/iris/${v}/wings/5090299178847069383-1906271825-1/-688384725346268286-1906271825-1`
        );
      });
    });
  });
});
