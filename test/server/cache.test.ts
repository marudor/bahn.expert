import { createNewCache } from 'server/cache';

describe('Cache', () => {
  const defineCacheTests = (
    createCache: () => ReturnType<typeof createNewCache>
  ) => {
    const cache: ReturnType<typeof createNewCache> = createCache();

    it('can save explicit undefined', async () => {
      await cache.set('undef', undefined);
      expect(await cache.get('undef')).toBeUndefined();
    });
    it('can save implicit undefined', async () => {
      // @ts-expect-error
      await cache.set('');
      expect(await cache.get('')).toBeUndefined();
    });
    it('can save null', async () => {
      await cache.set('null', null);
      expect(await cache.get('null')).toBeNull();
    });

    return cache;
  };

  describe('memory', () => {
    defineCacheTests(() => createNewCache(100, 0, false));
  });

  if (process.env.REDIS_HOST) {
    describe('redis', () => {
      const cache = defineCacheTests(() => createNewCache(100, 1, true));

      afterAll(async () => {
        await cache.del('');
        await cache.del('null');
        await cache.del('undef');
        // @ts-expect-error
        cache.store.getClient().disconnect();
      });
    });
  }
});
