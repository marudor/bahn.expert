import os from 'node:os';
import type {
	JourneyEventBased as JourneyEventBasedV1,
	JourneyMatch,
} from '@/external/generated/risJourneys';
import type {
	JourneyEventBased,
	JourneyFindResult,
} from '@/external/generated/risJourneysV2';
import type { VehicleLayoutFeatureCollection } from '@/external/generated/risMaps';
import type { StopPlace } from '@/external/generated/risStations';
import type {
	JourneyOccupancy,
	MatchVehicleID,
} from '@/external/generated/risTransports';
import type { ResolvedStopPlaceGroups } from '@/external/types';
import { logger } from '@/server/logger';
import type { AdditionalJourneyInformation } from '@/types/HAFAS/JourneyDetails';
import type { ParsedJourneyMatchResponse } from '@/types/HAFAS/JourneyMatch';
import type { ParsedSearchOnTripResponse } from '@/types/HAFAS/SearchOnTrip';
import type {
	CoachSequenceCoachFeatures,
	CoachSequenceInformation,
} from '@/types/coachSequence';
import type { IrisStation } from '@/types/iris';
import type { RouteAuslastung } from '@/types/routing';
import type {
	GroupedStopPlace,
	StopPlaceIdentifier,
	TrainOccupancyList,
} from '@/types/stopPlace';
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
	// LocMatch = 3,
	// HIMMessage = 4,
	// NAHSHLageplan = 5,
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
	BahnDEJourneyDetails = 27,
}

interface CacheDatabaseTypes {
	[CacheDatabase.AdditionalJourneyInformation]:
		| AdditionalJourneyInformation
		| undefined;
	[CacheDatabase.BahnDEJourneyDetails]: ParsedSearchOnTripResponse;
	[CacheDatabase.CoachSequenceRemovedData]: Record<
		string,
		{
			identificationNumber: string;
			features: CoachSequenceCoachFeatures;
		}
	>;
	[CacheDatabase.DBLageplan]: string | null;
	[CacheDatabase.HAFASJourneyMatch]: ParsedJourneyMatchResponse[];
	[CacheDatabase.HafasStopOccupancy]: RouteAuslastung | undefined;
	[CacheDatabase.IrisTTSStation]: IrisStation | null;
	[CacheDatabase.Journey]: JourneyEventBasedV1;
	[CacheDatabase.JourneyFind]: JourneyMatch[];
	[CacheDatabase.JourneyFindV2]: JourneyFindResult[];
	[CacheDatabase.JourneyV2]: JourneyEventBased;
	[CacheDatabase.JourneysForVehicle]: {
		previousJourneys: MatchVehicleID[];
		nextJourneys: MatchVehicleID[];
	};
	[CacheDatabase.NegativeNewSequence]: boolean;
	[CacheDatabase.ParsedCoachSequenceFound]: CoachSequenceInformation;
	[CacheDatabase.StopPlaceByEva]: GroupedStopPlace;
	[CacheDatabase.StopPlaceByRil]: StopPlace;
	[CacheDatabase.StopPlaceByRilGrouped]: GroupedStopPlace;
	[CacheDatabase.StopPlaceGroups]: ResolvedStopPlaceGroups;
	[CacheDatabase.StopPlaceIdentifier]: StopPlaceIdentifier | undefined;
	[CacheDatabase.StopPlaceSalesSearch]: GroupedStopPlace[];
	[CacheDatabase.StopPlaceSearch]: GroupedStopPlace[];
	[CacheDatabase.TimetableParsedWithWings]: {
		timetable: Record<string, any>;
		wingIds: Record<string, string>;
	};
	[CacheDatabase.TransportsOccupancy]: JourneyOccupancy | undefined;
	[CacheDatabase.VRROccupancy]: TrainOccupancyList | null;
	[CacheDatabase.VehicleLayoutsMaps]: VehicleLayoutFeatureCollection | null;
}

const CacheTTLs: Record<keyof CacheDatabaseTypes & CacheDatabase, string> = {
	[CacheDatabase.IrisTTSStation]: 'P2D',
	[CacheDatabase.TimetableParsedWithWings]: 'P1D',
	[CacheDatabase.DBLageplan]: 'P1D',
	[CacheDatabase.StopPlaceSearch]: 'P3D',
	[CacheDatabase.ParsedCoachSequenceFound]: parseCacheTTL(
		'PT15M',
		process.env.COACH_SEQUENCE_CACHE_TTL,
	),
	[CacheDatabase.StopPlaceIdentifier]: 'P5D',
	[CacheDatabase.StopPlaceByEva]: 'P5D',
	[CacheDatabase.StopPlaceByRil]: 'P5D',
	[CacheDatabase.StopPlaceByRilGrouped]: 'P5D',
	[CacheDatabase.StopPlaceGroups]: 'P5D',
	[CacheDatabase.StopPlaceSalesSearch]: 'P5D',
	[CacheDatabase.HAFASJourneyMatch]: 'P2D',
	[CacheDatabase.NegativeNewSequence]: 'PT6H',
	[CacheDatabase.HafasStopOccupancy]: 'PT30M',
	[CacheDatabase.AdditionalJourneyInformation]: 'PT10M',
	[CacheDatabase.JourneyFind]: 'P2D',
	[CacheDatabase.JourneyFindV2]: 'P2D',
	[CacheDatabase.Journey]: parseCacheTTL(
		'PT5M',
		process.env.RIS_JOURNEYS_CACHE_TTL,
	),
	[CacheDatabase.JourneyV2]: parseCacheTTL(
		'PT5M',
		process.env.RIS_JOURNEYS_CACHE_TTL,
	),
	[CacheDatabase.CoachSequenceRemovedData]: 'P2D',
	[CacheDatabase.VRROccupancy]: 'PT2H',
	[CacheDatabase.VehicleLayoutsMaps]: 'P20D',
	[CacheDatabase.TransportsOccupancy]: 'P1D',
	[CacheDatabase.JourneysForVehicle]: 'PT2H',
	[CacheDatabase.BahnDEJourneyDetails]: 'PT4M',
};

const activeRedisCaches = new Set<Redis>();

export function disconnectRedis(): void {
	for (const r of activeRedisCaches) {
		void r.quit();
	}
}

const caches: Partial<Record<CacheDatabase, Cache<any>>> = {};

export function getCache<T extends CacheDatabase>(
	type: T,
): Cache<CacheDatabaseTypes[T]> {
	if (!caches[type]) {
		caches[type] = new Cache(type);
	}
	return caches[type];
}

export type CacheType<C extends Cache<any>> = C extends Cache<infer X>
	? X
	: never;
class Cache<V> {
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
			this.redisCache.call(
				'client',
				'setname',
				`${CacheDatabase[database]}-${os.hostname()}`,
			);
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
	async getDelete(key: string): Promise<V | undefined> {
		try {
			const redisCached = await this.redisCache?.getdel(key);
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
		const entries: [string, V][] = [];
		for (const key of keys) {
			const value = await this.get(key);
			if (value) {
				entries.push([key, value]);
			}
		}
		return entries;
	}
	async keys(pattern: string): Promise<string[]> {
		if (this.redisCache) {
			return this.redisCache.keys(pattern);
		}
		return [];
	}
}
