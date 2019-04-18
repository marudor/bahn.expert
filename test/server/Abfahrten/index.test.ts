import { reduceResults } from 'server/Abfahrten';
import { Result } from 'server/Abfahrten/Timetable';

describe('Abfahrten', () => {
  describe('Lageplan result reduce', () => {
    const baseResult = {
      departures: [],
      lookbehind: [],
      wings: {},
      lageplan: undefined,
    };
    const rLageplan = (lageplan?: null | string): Result => ({
      departures: [],
      lookbehind: [],
      wings: {},
      lageplan,
    });
    const testData = (data: Result[]) =>
      expect(data.reduce(reduceResults, baseResult).lageplan);

    it('all undefined', () => {
      const data = [rLageplan(undefined), rLageplan(undefined)];

      testData(data).toBeUndefined();
    });

    it('first null', () => {
      const data = [rLageplan(null), rLageplan(undefined)];

      testData(data).toBeNull();
    });

    it('second null', () => {
      const data = [rLageplan(undefined), rLageplan(null)];

      testData(data).toBeNull();
    });

    it('null in middle', () => {
      const data = [
        rLageplan(undefined),
        rLageplan(null),
        rLageplan(undefined),
      ];

      testData(data).toBeNull();
    });

    it('Result first', () => {
      const data = [rLageplan('lageplan'), rLageplan(undefined)];

      testData(data).toBe('lageplan');
    });

    it('Result second', () => {
      const data = [rLageplan(undefined), rLageplan('lageplan')];

      testData(data).toBe('lageplan');
    });

    it('Result second, null first', () => {
      const data = [rLageplan(null), rLageplan('lageplan')];

      testData(data).toBe('lageplan');
    });

    it('Result first, null second', () => {
      const data = [rLageplan('lageplan'), rLageplan(null)];

      testData(data).toBe('lageplan');
    });
  });
});
