import { minBy } from 'client/util';

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
