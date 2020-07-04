import uniqBy from '../uniqBy';

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
