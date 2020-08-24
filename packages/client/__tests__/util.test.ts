import { maxBy, minBy, orderBy, uniqBy } from '../util';

describe('util', () => {
  describe('minBy', () => {
    it('simple', () => {
      expect(minBy([1, 2, 3])).toBe(1);
      expect(minBy([2, 3, 1])).toBe(1);
      expect(minBy([2, 3])).toBe(2);
      expect(minBy([3])).toBe(3);
      expect(minBy([])).toBe(undefined);
    });
    it('identifier', () => {
      expect(
        minBy(
          [
            {
              a: 1,
            },
            {
              a: 2,
            },
          ],
          'a',
        ),
      ).toEqual({
        a: 1,
      });
      expect(
        minBy(
          [
            {
              a: 2,
            },
            {
              a: 4,
            },
          ],
          'a',
        ),
      ).toEqual({
        a: 2,
      });
      expect(minBy([], 'a')).toEqual(undefined);
    });
    it('function', () => {
      expect(
        minBy(
          [
            {
              a: 1,
            },
            {
              a: 2,
            },
          ],
          (a) => a.a,
        ),
      ).toEqual({
        a: 1,
      });
      expect(
        minBy(
          [
            {
              a: 1,
              b: '123',
            },
            {
              a: 2,
              b: '21',
            },
          ],
          (a) => Number.parseInt(a.b),
        ),
      ).toEqual({
        a: 2,
        b: '21',
      });
    });
  });

  describe('maxBy', () => {
    it('simple', () => {
      expect(maxBy([1, 2, 3])).toBe(3);
      expect(maxBy([2, 3, 1])).toBe(3);
      expect(maxBy([1, 2])).toBe(2);
      expect(maxBy([1])).toBe(1);
      expect(maxBy([])).toBe(undefined);
    });
    it('identifier', () => {
      expect(
        maxBy(
          [
            {
              a: 1,
            },
            {
              a: 2,
            },
          ],
          'a',
        ),
      ).toEqual({
        a: 2,
      });
      expect(
        maxBy(
          [
            {
              a: 2,
            },
            {
              a: 4,
            },
          ],
          'a',
        ),
      ).toEqual({
        a: 4,
      });
      expect(minBy([], 'a')).toEqual(undefined);
    });
    it('function', () => {
      expect(
        maxBy(
          [
            {
              a: 1,
            },
            {
              a: 2,
            },
          ],
          (a) => a.a,
        ),
      ).toEqual({
        a: 2,
      });
      expect(
        maxBy(
          [
            {
              a: 1,
              b: '123',
            },
            {
              a: 2,
              b: '21',
            },
          ],
          (a) => Number.parseInt(a.b),
        ),
      ).toEqual({
        a: 1,
        b: '123',
      });
    });
  });

  describe('orderBy', () => {
    it('simple', () => {
      const base = [
        {
          a: 1,
        },
        {
          a: 2,
        },
        {
          a: 3,
        },
      ];
      expect(orderBy(base, 'a')).toEqual(base);
      expect(orderBy(base, 'a', 'desc')).toEqual([...base].reverse());
    });

    it('advanced', () => {
      const base = [
        {
          a: 1,
          b: 1,
        },
        {
          a: 3,
          b: 2,
        },
        {
          a: 3,
          b: 3,
        },
        {
          a: 2,
          b: 4,
        },
        {
          a: 1,
          b: 5,
        },
      ];
      expect(orderBy(base, 'a')).toEqual([
        {
          a: 1,
          b: 1,
        },
        {
          a: 1,
          b: 5,
        },
        {
          a: 2,
          b: 4,
        },
        {
          a: 3,
          b: 2,
        },
        {
          a: 3,
          b: 3,
        },
      ]);
    });
  });

  describe('uniqBy', () => {
    it('All elements Unique', () => {
      const base = [
        {
          a: 1,
        },
        {
          a: 2,
        },
        {
          a: 3,
        },
      ];
      expect(uniqBy(base, 'a')).toEqual(base);
    });

    it('All elements same', () => {
      const base = [
        {
          a: 1,
          b: 2,
        },
        {
          a: 1,
        },
        {
          a: 1,
        },
      ];
      expect(uniqBy(base, 'a')).toEqual([{ a: 1, b: 2 }]);
    });

    it('First entry kept', () => {
      const base = [
        {
          a: 1,
          b: 1,
        },
        {
          a: 2,
          b: 1,
        },
        {
          a: 1,
          b: 2,
        },
      ];
      expect(uniqBy(base, 'a')).toEqual([
        {
          a: 1,
          b: 1,
        },
        {
          a: 2,
          b: 1,
        },
      ]);
      expect(uniqBy(base, 'b')).toEqual([
        {
          a: 1,
          b: 1,
        },
        {
          a: 1,
          b: 2,
        },
      ]);
    });
  });
});
