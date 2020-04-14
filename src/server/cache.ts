import { logger } from 'server/logger';
import cacheManager, { Cache } from 'cache-manager';
import redisStore from 'cache-manager-ioredis';

const redisSettings = process.env.REDIS_HOST
  ? {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT
        ? Number.parseInt(process.env.REDIS_PORT, 10)
        : 6379,
      password: process.env.REDIS_PASSWORD,
    }
  : undefined;

export enum CacheDatabases {
  Station,
  Timetable,
  Lageplan,
  LocMatch,
  StationSearch,
}
const activeCaches = new Set();

export function createNewCache<K extends string, V>(
  ttl: number,
  db: CacheDatabases,
  useRedis = Boolean(redisSettings)
) {
  let baseCache: Cache;
  let existsFn: (key: string) => Promise<boolean>;

  if (useRedis) {
    baseCache = cacheManager.caching({
      ...redisSettings,
      store: redisStore,
      ttl,
      db,
    });
    // @ts-expect-error
    const client = baseCache.store.getClient();

    activeCaches.add(client);

    existsFn = client.exists.bind(client);
    logger.info(`Creating redis cache! (${db})`);
  } else {
    baseCache = cacheManager.caching({
      store: 'memory',
      ttl,
    });
    existsFn = baseCache.get;
  }

  return {
    async get(key: K): Promise<V | undefined> {
      const exists = await existsFn(key);

      if (!exists) return undefined;

      return baseCache.get(key).then((raw) => {
        return JSON.parse(raw);
      });
    },
    set(key: K, value: V) {
      if (value === undefined) {
        return baseCache.del(key);
      }

      return baseCache.set(key, JSON.stringify(value), ttl);
    },
    del(key: K) {
      return baseCache.del(key);
    },
    store: baseCache.store,
  };
}

export function cleanupCaches() {
  activeCaches.forEach((c: any) => c.disconnect());
  activeCaches.clear();
}
