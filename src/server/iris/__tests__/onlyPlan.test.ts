/* eslint-disable unicorn/prefer-module */
/* eslint no-sync: 0 */
import {
  mockFchg,
  mockLageplan,
  mockSearch,
} from 'server/__tests__/mockHelper';
import fakeTimers from '@sinonjs/fake-timers';
import fs from 'node:fs';
import path from 'node:path';
import Timetable from 'server/iris/Timetable';
import type { InstalledClock } from '@sinonjs/fake-timers';

jest.mock('server/cache');

describe('onlyPlan', () => {
  let clock: InstalledClock;

  beforeAll(() => {
    clock = fakeTimers.install({
      shouldAdvanceTime: true,
      now: 1552824000000,
    });
  });
  afterAll(() => {
    clock.uninstall();
  });
  const baseFixturePath = '__fixtures__/plan';
  const fixtures = fs.readdirSync(path.resolve(__dirname, baseFixturePath));

  for (const file of fixtures) {
    // eslint-disable-next-line jest/valid-title
    it(file, async () => {
      const inXml = fs.readFileSync(
        path.resolve(__dirname, baseFixturePath, file),
        'utf8',
      );

      mockLageplan();
      mockFchg();
      mockSearch(3, ['', inXml]);
      const timetable = new Timetable('test', 'test', {
        lookahead: 120,
        lookbehind: 60,
      });

      await expect(timetable.start()).resolves.toMatchSnapshot();
    });
  }
});
