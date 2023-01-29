import { partition } from '@/client/util';

describe('partition', () => {
  it('smaller than partitionSize', () => {
    const array = [1, 2, 3, 4, 5, 6, 7];
    const partitioned = partition(array, 10);

    expect(array).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(partitioned).toEqual([array]);
  });
});
