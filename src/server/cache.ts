import { checkSecrets } from 'server/checkSecret';
import { logger } from 'server/logger';
import LRUCache from 'lru-cache';
import Redis from 'ioredis';
import v8 from 'node:v8';

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

checkSecrets(process.env.REDIS_HOST);

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
  TimetableParsedWithWings,
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
  NegativeNewSequence = 14,
  // Was TimetableParsedPlan
  HafasStopOccupancy = 16,
  AdditionalJourneyInformation,
}

const parsedEnvTTL = Number.parseInt(process.env.DEFAULT_TTL!);
const defaultTTL = Number.isNaN(parsedEnvTTL) ? 24 * 60 * 60 : parsedEnvTTL;

const activeRedisCaches = new Set<Redis>();

export function disconnectRedis(): void {
  for (const r of activeRedisCaches) {
    void r.quit();
  }
}

export class Cache<K extends string, V> {
  private lruCache?: LRUCache<K, Buffer>;
  private redisCache?: Redis;
  constructor(
    database: CacheDatabase,
    /** In Seconds */
    private ttl: number = defaultTTL,
    maxEntries = 1000000,
    // eslint-disable-next-line unicorn/no-object-as-default-parameter
    { skipMemory, skipRedis }: { skipMemory?: boolean; skipRedis?: boolean } = {
      skipRedis: !redisSettings,
      skipMemory: Boolean(redisSettings),
    },
  ) {
    this.lruCache = skipMemory
      ? undefined
      : new LRUCache({
          /** in ms */
          ttl: (ttl / 2) * 1000,
          max: maxEntries / 500,
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
  private memorySet(key: K, value: V) {
    this.lruCache?.set(key, v8.serialize(value));
  }
  async get(key: K): Promise<V | undefined> {
    if (this.lruCache?.has(key)) {
      const cached = this.lruCache?.get(key);
      if (cached) {
        return v8.deserialize(cached);
      }
    }
    try {
      const redisCached = await this.redisCache?.get(key);
      const deserialized = this.redisDeserialize(redisCached);
      try {
        if (deserialized) {
          this.memorySet(key, deserialized);
        }
      } catch {
        // we ignore this, memory set just failed
      }
      return deserialized;
    } catch (e) {
      logger.error(e, 'Redis get failed');
    }
  }
  async set(key: K, value: V): Promise<void> {
    this.memorySet(key, value);
    try {
      await this.redisCache?.set(
        key,
        this.redisSerialize(value),
        'EX',
        this.ttl,
      );
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
