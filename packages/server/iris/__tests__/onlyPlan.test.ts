/* eslint no-sync: 0 */
import {
  mockFchg,
  mockLageplan,
  mockSearch,
} from 'server/__tests__/mockHelper';
import { noncdRequest } from 'server/iris/helper';
import fakeTimers from '@sinonjs/fake-timers';
import fs from 'fs';
import path from 'path';
import Timetable from 'server/iris/Timetable';

jest.mock('server/cache');

describe('onlyPlan', () => {
  let clock: ReturnType<typeof fakeTimers.install>;

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

  fixtures.forEach((file) => {
    // eslint-disable-next-line jest/valid-title
    it(file, async () => {
      const inXml = fs.readFileSync(
        path.resolve(__dirname, baseFixturePath, file),
        'utf8',
      );

      mockLageplan();
      mockFchg();
      mockSearch(3, ['', inXml]);
      const timetable = new Timetable(
        'test',
        'test',
        {
          lookahead: 120,
          lookbehind: 60,
        },
        noncdRequest,
      );

      await expect(timetable.start()).resolves.toMatchSnapshot();
    });
  });
});
