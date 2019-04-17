/* eslint no-sync: 0 */
import { mockFchg, mockLageplan, mockSearch } from './mockHelper';
import { noncdAxios } from 'server/Abfahrten';
import fs from 'fs';
import lolex from 'lolex';
import path from 'path';
import Timetable from 'server/Abfahrten/Timetable';

jest.mock('node-cache');

describe('onlyPlan', () => {
  let clock: ReturnType<typeof lolex.install>;

  beforeAll(() => {
    clock = lolex.install({
      shouldAdvanceTime: true,
      now: 1552824000000,
    });
  });
  afterAll(() => {
    clock.uninstall();
  });
  const baseFixturePath = 'fixtures/plan';
  const fixtures = fs.readdirSync(path.resolve(__dirname, baseFixturePath));

  fixtures.forEach(file => {
    it(file, async () => {
      const inXml = fs.readFileSync(
        path.resolve(__dirname, baseFixturePath, file),
        'utf8'
      );

      mockLageplan();
      mockFchg();
      mockSearch(2, [inXml]);
      const timetable = new Timetable(
        'test',
        'test',
        {
          lookahead: 120,
          lookbehind: 0,
        },
        noncdAxios
      );

      await expect(timetable.start()).resolves.toMatchSnapshot();
    });
  });
});
