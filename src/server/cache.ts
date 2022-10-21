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

export const enum CacheDatabases {
  Station,
  TimetableXML,
  DBLageplan,
  LocMatch,
  HIMMessage,
  NAHSHLageplan,
  StopPlaceSearch,
  StopPlaceGeo,
  StopPlaceIdentifier,
  StopPlaceByEva,
  StopPlaceByRil,
  StopPlaceGroups,
  StopPlaceSalesSearch,
  JourneyFind,
  NegativeNewSequence,
  TimetableParsedPlan,
}
const activeCaches: Set<any> = new Set();

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
    return new Date(value.slice(4));
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

const parsedEnvTTL = Number.parseInt(process.env.DEFAULT_TTL!);
const defaultTTL = Number.isNaN(parsedEnvTTL) ? 12 * 60 * 60 : parsedEnvTTL;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function createNewCache<K extends string, V>(
  db: CacheDatabases,
  /** in seconds */
  ttl: number = defaultTTL,
  useRedis = Boolean(redisSettings),
) {
  let baseCache: Cache;
  let existsFn: (key: string) => Promise<boolean>;
  let keysFn: () => Promise<string[]>;
  let mgetFn: (keys: K[]) => Promise<(string | null)[]>;

  if (useRedis) {
    baseCache = cacheManager.caching({
      ...redisSettings,
      // eslint-disable-next-line unicorn/prefer-module
      store: require('cache-manager-ioredis'),
      ttl,
      db,
      max: 1000000,
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
      max: 1000000,
    });
    // eslint-disable-next-line @typescript-eslint/unbound-method
    existsFn = baseCache.get;
    // @ts-expect-error baseCache untyped
    keysFn = baseCache.keys;
    // @ts-expect-error baseCache untyped
    mgetFn = (keys) => baseCache.store.mget(...keys);
  }

  return {
    exists(key: K): Promise<boolean> {
      return existsFn(key);
    },
    async mget(keys: K[]): Promise<(V | undefined)[]> {
      try {
        const rawResult = await mgetFn(keys);

        return rawResult.map(deserialize);
      } catch {
        return [];
      }
    },
    async get(key: K): Promise<V | undefined> {
      try {
        const result = await baseCache.get<string>(key).then(deserialize);

        return result;
      } catch {
        return undefined;
      }
    },
    async set(key: K, value: V) {
      try {
        return await baseCache.set(key, serialize(value), ttl);
      } catch {
        // ignoring
      }
    },
    async del(key: K) {
      try {
        return await baseCache.del(key);
      } catch {
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
  for (const c of activeCaches) {
    c.disconnect();
  }
  activeCaches.clear();
}
