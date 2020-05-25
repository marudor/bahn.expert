import * as Sentry from '@sentry/node';
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
      dropBufferSupport: true,
    }
  : undefined;

export enum CacheDatabases {
  Station,
  Timetable,
  Lageplan,
  LocMatch,
  StationSearch,
  HIMMessage,
  CouchSequence,
  TimetableAll,
}
const activeCaches = new Set();

function deserialize(raw: string | null) {
  if (raw === null) return undefined;
  if (raw === '__UNDEF__INED__') return undefined;

  return JSON.parse(raw);
}

function serialize(raw: any) {
  if (raw === undefined) return '__UNDEF__INED__';

  return JSON.stringify(raw);
}

export function createNewCache<K extends string, V>(
  ttl: number,
  db: CacheDatabases,
  useRedis = Boolean(redisSettings)
) {
  let baseCache: Cache;
  let existsFn: (key: string) => Promise<boolean>;
  let keysFn: () => Promise<string[]>;
  let mgetFn: (keys: K[]) => Promise<(string | null)[]>;

  if (useRedis) {
    baseCache = cacheManager.caching({
      ...redisSettings,
      store: redisStore,
      ttl,
      db,
    });
    // @ts-ignore
    const client = baseCache.store.getClient();

    activeCaches.add(client);

    existsFn = client.exists.bind(client);
    // @ts-ignore
    keysFn = baseCache.keys.bind(client, '*');
    mgetFn = async (keys) => {
      const rawResult = await client.mget(keys);

      return rawResult.map(JSON.parse);
    };
    logger.info(`Creating redis cache! (${db})`);
  } else {
    baseCache = cacheManager.caching({
      store: 'memory',
      ttl,
    });
    existsFn = baseCache.get;
    // @ts-ignore
    keysFn = baseCache.keys;
    mgetFn = (keys) => baseCache.store.mget!(...keys);
  }

  return {
    exists(key: K): Promise<boolean> {
      return existsFn(key);
    },
    async mget(keys: K[]): Promise<(V | undefined)[]> {
      try {
        const rawResult = await mgetFn(keys);

        return rawResult.map(deserialize);
      } catch (e) {
        Sentry.captureException(e);

        return [];
      }
    },
    async get(key: K): Promise<V | undefined> {
      try {
        const exists = await existsFn(key);

        if (!exists) return undefined;

        const result = await baseCache.get(key).then(deserialize);

        return result;
      } catch (e) {
        Sentry.captureException(e);

        return undefined;
      }
    },
    async set(key: K, value: V) {
      try {
        return await baseCache.set(key, serialize(value), ttl);
      } catch (e) {
        Sentry.captureException(e);
      }
    },
    async del(key: K) {
      try {
        return await baseCache.del(key);
      } catch (e) {
        Sentry.captureException(e);
      }
    },
    keys() {
      return keysFn();
    },
    reset(): Promise<void> {
      // @ts-ignore
      return baseCache.reset();
    },
    store: baseCache.store,
    baseCache,
  };
}

export function cleanupCaches() {
  activeCaches.forEach((c: any) => c.disconnect());
  activeCaches.clear();
}
