import Nock from 'nock';

const emptyTimetable = '<timetable station="empty"></timetable>';

export function mockLageplan(bahnhof = 'test', lageplan = ''): void {
  Nock('https://www.bahnhof.de')
    .get('/service/search/bahnhof-de/520608')
    .query({ query: bahnhof })
    .reply(200, lageplan);
}

export function mockSearch(
  count: number,
  results: string[],
  startTime = 12,
): void {
  for (let i = 0; i <= count; i += 1) {
    const hour = startTime + i;

    Nock('https://iris.noncd.db.de')
      .get(`/iris-tts/timetable/plan/test/190317/${hour}`)
      .reply(200, results[i] || emptyTimetable);
  }
}

export function mockFchg(result: string = emptyTimetable): void {
  Nock('https://iris.noncd.db.de')
    .get('/iris-tts/timetable/fchg/test')
    .reply(200, result);
}
