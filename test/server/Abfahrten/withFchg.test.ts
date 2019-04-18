/* eslint no-sync: 0 */
import { mockFchg, mockLageplan, mockSearch } from './mockHelper';
import { noncdAxios } from 'server/Abfahrten';
import fs from 'fs';
import lolex, { Clock, InstalledClock } from 'lolex';
import path from 'path';
import Timetable from 'server/Abfahrten/Timetable';

jest.mock('node-cache');

describe('withFchg', () => {
  let clock: InstalledClock<Clock>;

  beforeAll(() => {
    clock = lolex.install({
      shouldAdvanceTime: true,
      now: 1552824000000,
    });
  });
  afterAll(() => {
    clock.uninstall();
  });
  const baseFixturePath = 'fixtures';
  const fchgFixtures = fs.readdirSync(
    path.resolve(__dirname, baseFixturePath, 'fchg')
  );

  fchgFixtures.forEach(file => {
    it(file, async () => {
      const fchgXml = fs.readFileSync(
        path.resolve(__dirname, baseFixturePath, 'fchg', file),
        'utf8'
      );
      const planxml = fs.readFileSync(
        path.resolve(__dirname, baseFixturePath, 'plan', file),
        'utf8'
      );

      mockLageplan();
      mockFchg(fchgXml);
      mockSearch(3, ['', planxml]);
      const timetable = new Timetable(
        'test',
        'test',
        {
          lookahead: 120,
          lookbehind: 60,
        },
        noncdAxios
      );

      await expect(timetable.start()).resolves.toMatchSnapshot();
    });
  });
});
