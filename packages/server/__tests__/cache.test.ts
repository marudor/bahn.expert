import { createNewCache } from 'server/cache';

describe('Cache', () => {
  const defineCacheTests = (
    createCache: () => ReturnType<typeof createNewCache>,
  ) => {
    const cache: ReturnType<typeof createNewCache> = createCache();

    it('can save explicit undefined', async () => {
      await cache.set('undef', undefined);
      expect(await cache.get('undef')).toBeUndefined();
    });
    it('can save implicit undefined', async () => {
      // @ts-ignore
      await cache.set('');
      expect(await cache.get('')).toBeUndefined();
    });
    it('can save null', async () => {
      await cache.set('null', null);
      expect(await cache.get('null')).toBeNull();
    });

    it('mget and get work the same', async () => {
      await cache.set('m1', 1);
      await cache.set('m2', {});
      await cache.set('m3', null);
      await cache.set('m4', undefined);

      await expect(cache.get('m1')).resolves.toBe(1);
      await expect(cache.get('m2')).resolves.toEqual({});
      await expect(cache.get('m3')).resolves.toBeNull();
      await expect(cache.get('m4')).resolves.toBeUndefined();
      await expect(cache.mget(['m1', 'm2', 'm3', 'm4'])).resolves.toEqual([
        1,
        {},
        null,
        undefined,
      ]);
    });
  };

  describe('memory', () => {
    defineCacheTests(() => createNewCache(100, 0, false));
  });

  if (process.env.REDIS_HOST) {
    describe('redis', () => {
      defineCacheTests(() => createNewCache(100, 1, true));
    });
  }
});
