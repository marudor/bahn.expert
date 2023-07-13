import { checkSecrets } from '@/server/checkSecret';
import { logger } from '@/server/logger';
import { LRUCache } from 'lru-cache';
import { Temporal } from '@js-temporal/polyfill';
import Redis from 'ioredis';
import v8 from 'node:v8';

export function parseCacheTTL(
  defaultTTL: string,
  rawCacheTTL?: string,
): string {
  if (!rawCacheTTL) {
    return defaultTTL;
  }
  if (!Number.isNaN(Number.parseInt(rawCacheTTL))) {
    return `PT${rawCacheTTL}S`;
  }
  try {
    Temporal.Duration.from(rawCacheTTL).total('second');
    return rawCacheTTL;
  } catch {
    return defaultTTL;
  }
}

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
  StopPlaceSearch = 6,
  CoachSequenceFound,
  StopPlaceIdentifier = 8,
  StopPlaceByEva,
  StopPlaceByRil,
  StopPlaceGroups,
  StopPlaceSalesSearch,
  JourneyFind,
  NegativeNewSequence = 14,
  SBBStopPlaces,
  HafasStopOccupancy = 16,
  AdditionalJourneyInformation,
  CoachSequenceNotfound,
  Journey,
}

const parsedEnvTTL = Number.parseInt(process.env.DEFAULT_TTL!);
const defaultTTL = Number.isNaN(parsedEnvTTL) ? 'PT24H' : parsedEnvTTL;

const activeRedisCaches = new Set<Redis>();

export function disconnectRedis(): void {
  for (const r of activeRedisCaches) {
    void r.quit();
  }
}

export class Cache<K extends string, V> {
  private lruCache?: LRUCache<K, Buffer>;
  private redisCache?: Redis;
  private ttl: number;
  constructor(
    database: CacheDatabase,
    /** In Seconds or ISO Duration **/
    rawTTL: number | string = defaultTTL,
    maxEntries = 1000000,
    // eslint-disable-next-line unicorn/no-object-as-default-parameter
    { skipMemory, skipRedis }: { skipMemory?: boolean; skipRedis?: boolean } = {
      skipRedis: !redisSettings,
      skipMemory: Boolean(redisSettings),
    },
  ) {
    if (typeof rawTTL === 'string') {
      const duration = Temporal.Duration.from(rawTTL);
      this.ttl = duration.total('second');
    } else {
      this.ttl = rawTTL;
    }
    this.lruCache = skipMemory
      ? undefined
      : new LRUCache({
          /** in ms */
          ttl: (this.ttl / 2) * 1000,
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
