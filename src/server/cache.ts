import { logger } from '@/server/logger';
import { Temporal } from '@js-temporal/polyfill';
import Redis from 'ioredis';

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
	if (this[key] instanceof Date) {
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

const redisSettings =
	process.env.REDIS_HOST && process.env.NODE_ENV !== 'test'
		? {
				host: process.env.REDIS_HOST,
				port: process.env.REDIS_PORT
					? Number.parseInt(process.env.REDIS_PORT, 10)
					: 6379,
			}
		: undefined;

export enum CacheDatabase {
	IrisTTSStation = 0,
	TimetableParsedWithWings = 1,
	DBLageplan = 2,
	LocMatch = 3,
	HIMMessage = 4,
	NAHSHLageplan = 5,
	StopPlaceSearch = 6,
	StopPlaceByRilGrouped = 7,
	StopPlaceIdentifier = 8,
	StopPlaceByEva = 9,
	StopPlaceByRil = 10,
	StopPlaceGroups = 11,
	StopPlaceSalesSearch = 12,
	JourneyFind = 13,
	NegativeNewSequence = 14,
	TransportsOccupancy = 15,
	HafasStopOccupancy = 16,
	AdditionalJourneyInformation = 17,
	HAFASJourneyMatch = 18,
	Journey = 19,
	JourneysForVehicle = 20,
	ParsedCoachSequenceFound = 21,
	JourneyFindV2 = 22,
	JourneyV2 = 23,
	CoachSequenceRemovedData = 24,
	VRROccupancy = 25,
	VehicleLayoutsMaps = 26,
}

const CacheTTLs: Record<CacheDatabase, string> = {
	[CacheDatabase.IrisTTSStation]: 'PT24H',
	[CacheDatabase.TimetableParsedWithWings]: 'PT24H',
	[CacheDatabase.DBLageplan]: 'PT48H',
	[CacheDatabase.LocMatch]: 'PT24H',
	[CacheDatabase.HIMMessage]: 'PT24H',
	[CacheDatabase.NAHSHLageplan]: 'PT48H',
	[CacheDatabase.StopPlaceSearch]: 'P2D',
	[CacheDatabase.ParsedCoachSequenceFound]: parseCacheTTL(
		'PT15M',
		process.env.COACH_SEQUENCE_CACHE_TTL,
	),
	[CacheDatabase.StopPlaceIdentifier]: 'P2D',
	[CacheDatabase.StopPlaceByEva]: 'P2D',
	[CacheDatabase.StopPlaceByRil]: 'P2D',
	[CacheDatabase.StopPlaceByRilGrouped]: 'P2D',
	[CacheDatabase.StopPlaceGroups]: 'P2D',
	[CacheDatabase.StopPlaceSalesSearch]: 'P2D',
	[CacheDatabase.HAFASJourneyMatch]: 'PT6H',
	[CacheDatabase.NegativeNewSequence]: 'PT6H',
	[CacheDatabase.HafasStopOccupancy]: 'PT30M',
	[CacheDatabase.AdditionalJourneyInformation]: 'PT10M',
	[CacheDatabase.JourneyFind]: 'PT12H',
	[CacheDatabase.JourneyFindV2]: 'PT12H',
	[CacheDatabase.Journey]: parseCacheTTL(
		'PT5M',
		process.env.RIS_JOURNEYS_CACHE_TTL,
	),
	[CacheDatabase.JourneyV2]: parseCacheTTL(
		'PT5M',
		process.env.RIS_JOURNEYS_CACHE_TTL,
	),
	[CacheDatabase.CoachSequenceRemovedData]: 'PT24H',
	[CacheDatabase.VRROccupancy]: 'PT60M',
	[CacheDatabase.VehicleLayoutsMaps]: 'P1D',
	[CacheDatabase.TransportsOccupancy]: 'P1D',
	[CacheDatabase.JourneysForVehicle]: 'PT12H',
};

const activeRedisCaches = new Set<Redis>();

export function disconnectRedis(): void {
	for (const r of activeRedisCaches) {
		void r.quit();
	}
}

export class Cache<V> {
	private redisCache?: Redis;
	private ttl: number;
	constructor(database: CacheDatabase, providedRedisSettings = redisSettings) {
		this.ttl = Temporal.Duration.from(CacheTTLs[database]).total('second');
		logger.info(
			`Using ${CacheTTLs[database]} as TTL for ${CacheDatabase[database]}`,
		);
		if (providedRedisSettings) {
			this.redisCache = new Redis({
				...providedRedisSettings,
				db: database,
			});
			activeRedisCaches.add(this.redisCache);
		} else {
			if (process.env.NODE_ENV !== 'test') {
				console.error('WARNING, RUNNING WITHOUT CACHE!');
			}
		}
	}
	private redisSerialize(raw: unknown) {
		if (raw === undefined) return '__UNDEF__INED__';
		return JSON.stringify(raw, dateSerialize);
	}
	private redisDeserialize(raw?: string | null) {
		if (raw == null) return undefined;
		if (raw === '__UNDEF__INED__') return undefined;

		return JSON.parse(raw, dateDeserialze);
	}
	async get(key: string): Promise<V | undefined> {
		try {
			const redisCached = await this.redisCache?.get(key);
			const deserialized = this.redisDeserialize(redisCached);
			return deserialized;
		} catch (e) {
			logger.error(e, 'Redis get failed');
		}
	}
	async set(
		key: string,
		value: V,
		rawTTL: number | string = this.ttl,
	): Promise<void> {
		const ttl =
			typeof rawTTL === 'number'
				? rawTTL
				: Temporal.Duration.from(rawTTL).total('second');
		try {
			await this.redisCache?.set(key, this.redisSerialize(value), 'EX', ttl);
		} catch (e) {
			logger.error(e, 'Redis set failed');
		}
	}
	async delete(key: string): Promise<number> {
		return this.redisCache?.del(key) ?? Promise.resolve(0);
	}
	async deleteAll(keys: string[]): Promise<number | undefined> {
		if (keys.length) {
			return this.redisCache?.del(keys);
		}
	}
	async exists(key: string): Promise<boolean> {
		return Boolean(await this.redisCache?.exists(key));
	}
	async clearAll(): Promise<void> {
		await this.redisCache?.flushall();
	}
	async getAll(): Promise<[string, V][]> {
		let keys: string[] = [];
		if (this.redisCache) {
			keys = await this.redisCache.keys('*');
		}
		// @ts-expect-error works
		const entries: [string, V][] = (
			await Promise.all(keys.map(async (k) => [k, await this.get(k)]))
		).filter(([_, value]) => Boolean(value));
		return entries;
	}
	async keys(pattern: string): Promise<string[]> {
		if (this.redisCache) {
			return this.redisCache.keys(pattern);
		}
		return [];
	}
}
