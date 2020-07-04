import orderBy from '../orderBy';

describe('uniqBy', () => {
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
