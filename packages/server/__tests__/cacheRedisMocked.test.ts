// @ts-ignore
import { baseCache } from 'cache-manager';
import { createNewCache } from 'server/cache';

jest.mock('cache-manager', () => {
  let simpleCache: any = {};
  const baseCache = {
    store: {
      getClient() {
        return {
          disconnect: jest.fn(),
          flushall: jest.fn(() => {
            simpleCache = {};
          }),
          exists: jest.fn((key) => Promise.resolve(key in simpleCache)),
          mget: jest.fn((keys) =>
            Promise.resolve(keys.map((k: string) => simpleCache[k])),
          ),
        };
      },
    },
    keys: jest.fn(() => Promise.resolve(Object.keys(simpleCache))),
    get: jest.fn((key) => Promise.resolve(simpleCache[key])),
    set: jest.fn((key, value) => {
      simpleCache[key] = value;

      return Promise.resolve();
    }),
    del: jest.fn((key) => {
      delete simpleCache[key];

      return Promise.resolve();
    }),
  };

  return {
    baseCache,
    caching() {
      return baseCache;
    },
  };
});

describe('Cache - redis mocked', () => {
  const cache = createNewCache(100, 0, true);

  it('get after set', async () => {
    await cache.set('test', 2);
    await expect(cache.get('test')).resolves.toBe(2);
  });

  it('baseCache rejects get, should resolve undefined', async () => {
    await cache.set('test', 2);
    baseCache.get.mockRejectedValueOnce(new Error());
    await expect(cache.get('test')).resolves.toBeUndefined();
  });

  it('baseCache rejects set, should resolve', async () => {
    baseCache.set.mockRejectedValueOnce(new Error());
    await expect(cache.set('test', 2)).resolves.toBeUndefined();
  });

  it('baseCache del rejects, should resolve', async () => {
    baseCache.del.mockRejectedValueOnce(new Error());
    await expect(cache.del('test')).resolves.toBeUndefined();
  });
});
