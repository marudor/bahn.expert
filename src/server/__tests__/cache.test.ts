import { Cache } from 'server/cache';

const defineCacheTests = (createCache: () => Cache<string, unknown>) => {
  const cache: Cache<string, unknown> = createCache();

  it('can save explicit undefined', async () => {
    await cache.set('undef', undefined);
    expect(await cache.get('undef')).toBeUndefined();
  });
  it('can save implicit undefined', async () => {
    // @ts-expect-error test only
    await cache.set('');
    expect(await cache.get('')).toBeUndefined();
  });
  it('can save null', async () => {
    await cache.set('null', null);
    expect(await cache.get('null')).toBeNull();
  });

  it('can save objects', async () => {
    const testObject = {
      foo: '1',
      bar: '2',
      foobar: undefined,
      really: null,
    };

    await cache.set('obj', testObject);
    expect(await cache.get('obj')).toEqual(testObject);
  });
};

describe('Cache', () => {
  describe('memory', () => {
    defineCacheTests(() => new Cache(0, 100, undefined, { skipRedis: true }));
  });

  if (process.env.REDIS_HOST) {
    describe('redis', () => {
      defineCacheTests(
        () => new Cache(1, 100, undefined, { skipMemory: true }),
      );
    });
  }
});
