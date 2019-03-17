// @flow
import Nock from 'nock';

const emptyTimetable = '<timetable station="empty"></timetable>';

export function mockLageplan(bahnhof: string = 'test', lageplan: string = '') {
  Nock('https://www.bahnhof.de')
    .get('/service/search/bahnhof-de/520608')
    .query({ query: bahnhof })
    .reply(200, lageplan);
}

export function mockSearch(count: number, results: string[]) {
  for (let i = 0; i <= count; i += 1) {
    const hour = 13 + i;

    Nock('http://iris.noncd.db.de')
      .get(`/iris-tts/timetable/plan/test/190317/${hour}`)
      .reply(200, results[i] || emptyTimetable);
  }
}

export function mockFchg(result: string = emptyTimetable) {
  Nock('http://iris.noncd.db.de')
    .get('/iris-tts/timetable/fchg/test')
    .reply(200, result);
}
