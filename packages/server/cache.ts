import { logger } from 'server/logger';
import cacheManager from 'cache-manager';
import type { Cache } from 'cache-manager';

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
  DBLageplan,
  LocMatch,
  HIMMessage,
  HVVLageplan,
  NAHSHLageplan,
  StopPlaceSearch,
  StopPlaceGeo,
  StopPlaceIdentifier,
  StopPlaceByEva,
  StopPlaceByRil,
  StopPlaceGroups,
}
const activeCaches = new Set();

function dateSerialize(this: any, key: string, value: any): any {
  // eslint-disable-next-line babel/no-invalid-this
  if (this[key] instanceof Date) {
    // eslint-disable-next-line babel/no-invalid-this
    return `DATE${this[key].toISOString()}`;
  }
  return value;
}

function dateDeserialze(_key: string, value: any): any {
  if (typeof value === 'string' && value.startsWith('DATE')) {
    return new Date(value.substr(4));
  }
  return value;
}

function deserialize(raw?: string | null) {
  if (raw == null) return undefined;
  if (raw === '__UNDEF__INED__') return undefined;

  return JSON.parse(raw, dateDeserialze);
}

function serialize(raw: any) {
  if (raw === undefined) return '__UNDEF__INED__';

  return JSON.stringify(raw, dateSerialize);
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function createNewCache<K extends string, V>(
  /** in seconds */
  ttl: number,
  db: CacheDatabases,
  useRedis = Boolean(redisSettings),
) {
  let baseCache: Cache;
  let existsFn: (key: string) => Promise<boolean>;
  let keysFn: () => Promise<string[]>;
  let mgetFn: (keys: K[]) => Promise<(string | null)[]>;

  if (useRedis) {
    baseCache = cacheManager.caching({
      ...redisSettings,
      store: require('cache-manager-ioredis'),
      ttl,
      db,
      max: 10000,
    });
    // @ts-expect-error baseCache untyped
    const client = baseCache.store.getClient();

    activeCaches.add(client);

    existsFn = client.exists.bind(client);
    // @ts-expect-error baseCache untyped
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
      max: 10000,
    });
    // eslint-disable-next-line @typescript-eslint/unbound-method
    existsFn = baseCache.get;
    // @ts-expect-error baseCache untyped
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
        return [];
      }
    },
    async get(key: K): Promise<V | undefined> {
      try {
        const exists = await existsFn(key);

        if (!exists) return undefined;

        const result = await baseCache.get<string>(key).then(deserialize);

        return result;
      } catch (e) {
        return undefined;
      }
    },
    async set(key: K, value: V) {
      try {
        return await baseCache.set(key, serialize(value), ttl);
      } catch (e) {
        // ignoring
      }
    },
    async del(key: K) {
      try {
        return await baseCache.del(key);
      } catch (e) {
        // ignoring
      }
    },
    keys() {
      return keysFn();
    },
    reset(): Promise<void> {
      return baseCache.reset();
    },
    store: baseCache.store,
    baseCache,
    wrap<T>(key: string, work: () => Promise<T>): Promise<T> {
      return baseCache.wrap(key, work);
    },
  };
}

export function cleanupCaches(): void {
  activeCaches.forEach((c: any) => c.disconnect());
  activeCaches.clear();
}
