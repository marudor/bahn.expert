import { logger } from 'server/logger';
import LRUCache from 'lru-cache';
import Redis from 'ioredis';

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

const redisSettings = process.env.REDIS_HOST
  ? {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT
        ? Number.parseInt(process.env.REDIS_PORT, 10)
        : 6379,
      password: process.env.REDIS_PASSWORD,
      // dropBufferSupport: true,
    }
  : undefined;

export const enum CacheDatabase {
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

const parsedEnvTTL = Number.parseInt(process.env.DEFAULT_TTL!);
const defaultTTL = Number.isNaN(parsedEnvTTL) ? 12 * 60 * 60 : parsedEnvTTL;

const activeRedisCaches = new Set<Redis>();

export function disconnectRedis(): void {
  for (const r of activeRedisCaches) {
    void r.quit();
  }
}

export class Cache<K extends string, V> {
  private lruCache?: LRUCache<K, V>;
  private redisCache?: Redis;
  constructor(
    database: CacheDatabase,
    ttl: number = defaultTTL,
    maxEntries = 1000000,
    // eslint-disable-next-line unicorn/no-object-as-default-parameter
    { skipMemory, skipRedis }: { skipMemory?: boolean; skipRedis?: boolean } = {
      skipRedis: !redisSettings,
    },
  ) {
    this.lruCache = skipMemory
      ? undefined
      : new LRUCache({
          ttl: ttl / 2,
          max: maxEntries / 200,
        });
    if (!skipRedis) {
      this.redisCache = new Redis({
        ...redisSettings,
        db: database,
      });
      activeRedisCaches.add(this.redisCache);
    }
  }
  private redisSerialize(raw: any) {
    if (raw === undefined) return '__UNDEF__INED__';
    return JSON.stringify(raw, dateSerialize);
  }
  private redisDeserialize(raw?: string | null) {
    if (raw == null) return undefined;
    if (raw === '__UNDEF__INED__') return undefined;

    return JSON.parse(raw, dateDeserialze);
  }
  async get(key: K): Promise<V | undefined> {
    const memoryCached = this.lruCache?.get(key);
    if (memoryCached !== undefined) {
      return memoryCached;
    }
    try {
      const redisCached = await this.redisCache?.get(key);
      return this.redisDeserialize(redisCached);
    } catch (e) {
      logger.error(e, 'Redis get failed');
    }
  }
  async set(key: K, value: V): Promise<void> {
    this.lruCache?.set(key, value);
    try {
      await this.redisCache?.set(key, this.redisSerialize(value));
    } catch (e) {
      logger.error(e, 'Redis set failed');
    }
  }
  async exists(key: K): Promise<boolean> {
    if (this.lruCache?.has(key)) {
      return true;
    }
    return Boolean(await this.redisCache?.exists(key));
  }
}
