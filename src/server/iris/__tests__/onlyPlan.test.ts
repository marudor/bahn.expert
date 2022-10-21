/* eslint-disable unicorn/prefer-module */
/* eslint no-sync: 0 */
import {
  mockFchg,
  mockLageplan,
  mockSearch,
} from 'server/__tests__/mockHelper';
import { Timetable } from 'server/iris/Timetable';
import fs from 'node:fs';
import path from 'node:path';

jest.mock('server/cache');

describe('onlyPlan', () => {
  beforeAll(() => {
    jest.useFakeTimers({
      advanceTimers: true,
      now: 1552824000000,
    });
  });
  afterAll(() => {
    jest.useRealTimers();
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
