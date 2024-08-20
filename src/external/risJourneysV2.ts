import {
	JourneysApi,
	Configuration as RisJourneysConfiguration,
} from '@/external/generated/risJourneysV2';
import type {
	JourneyEventBased,
	JourneyFindResult,
	JourneyInfo,
	StopPlaceEmbedded,
	Transport,
} from '@/external/generated/risJourneysV2';
import { getStopPlaceByEva } from '@/server/StopPlace/search';
import { axiosUpstreamInterceptor } from '@/server/admin';
import { Cache, CacheDatabase } from '@/server/cache';
import { additionalJourneyInformation } from '@/server/journeys/additionalJourneyInformation';
import type { ParsedProduct } from '@/types/HAFAS';
import type { ParsedJourneyMatchResponse } from '@/types/HAFAS/JourneyMatch';
import type { RouteStop } from '@/types/routing';
import axios from 'axios';
import { differenceInHours, format, isSameDay } from 'date-fns';

const risJourneysV2Configuration = new RisJourneysConfiguration({
	basePath: process.env.RIS_JOURNEYS_V2_URL,
	baseOptions: {
		headers: {
			'DB-Api-Key': process.env.RIS_JOURNEYS_V2_CLIENT_SECRET,
			'DB-Client-Id': process.env.RIS_JOURNEYS_V2_CLIENT_ID,
		},
	},
});

const axiosWithTimeout = axios.create({
	timeout: 6500,
});
axiosUpstreamInterceptor(axiosWithTimeout, 'ris-journeys-v2');
const client = new JourneysApi(
	risJourneysV2Configuration,
	undefined,
	axiosWithTimeout,
);

const journeyFindCache = new Cache<JourneyFindResult[]>(CacheDatabase.Journey);

const journeyCache = new Cache<JourneyEventBased>(CacheDatabase.JourneyV2);

export const health = {
	has401: false,
};

const longDistanceTypes: string[] = ['HIGH_SPEED_TRAIN', 'INTERCITY_TRAIN'];

const mapTransportToTrain = (transport: Transport): ParsedProduct => ({
	name: `${transport.category} ${
		longDistanceTypes.includes(transport.type)
			? transport.journeyNumber
			: transport.line || transport.journeyNumber
	}`,
	line: transport.line,
	type: transport.category,
	number: `${transport.journeyNumber}`,
	transportType: transport.type,
});

const mapStationShortToRouteStops = (
	station: StopPlaceEmbedded,
): RouteStop => ({
	station,
});

function mapToParsedJourneyMatchResponse(
	journeyFindResult: JourneyFindResult,
): ParsedJourneyMatchResponse {
	return {
		// Technically wrong!
		jid: journeyFindResult.journeyID,
		train: mapTransportToTrain(journeyFindResult.info.transportAtStart),
		stops: [],
		firstStop: mapStationShortToRouteStops(journeyFindResult.info.origin),
		lastStop: mapStationShortToRouteStops(journeyFindResult.info.destination),
	};
}

async function fixSingleStopIfNeeded(stop: StopPlaceEmbedded) {
	if (!stop.name && stop.evaNumber) {
		try {
			const stopPlace = await getStopPlaceByEva(stop.evaNumber);
			if (stopPlace) {
				stop.name = stopPlace.name;
			}
		} catch {
			// do nothing
		}
	}
}

async function fixSingleJourneyInfo(info: JourneyInfo) {
	await Promise.all([
		fixSingleStopIfNeeded(info.origin),
		fixSingleStopIfNeeded(info.destination),
	]);
}

async function fixJourneysFoundIfNeeded(
	journeys: JourneyFindResult[],
): Promise<void> {
	await Promise.all(
		journeys.flatMap(async (j) => fixSingleJourneyInfo(j.info)),
	);
}

export async function findJourney(
	trainNumber: number,
	category?: string,
	date?: Date,
	onlyFv?: boolean,
	originEvaNumber?: string,
	administration?: string,
): Promise<JourneyFindResult[]> {
	try {
		const notOlderThan7Days =
			date && differenceInHours(date, Date.now()) >= 160;
		if (!notOlderThan7Days) {
			return [];
		}

		const cacheKey = `${trainNumber}|${category?.toUpperCase()}|${
			date && format(date, 'yyyy-MM-dd')
		}|${onlyFv ?? false}|${originEvaNumber}`;

		const cacheHit = await journeyFindCache.get(cacheKey);
		if (cacheHit) {
			return cacheHit;
		}

		const result = await client.find({
			journeyNumber: trainNumber,
			category,
			date: date && format(date, 'yyyy-MM-dd'),
			transportTypes: onlyFv ? longDistanceTypes : undefined,
			administrationID: administration,
		});

		if (date) {
			result.data.journeys = result.data.journeys.filter((j) =>
				isSameDay(new Date(j.journeyRelation.startTime), date),
			);
		}

		if (notOlderThan7Days) {
			void journeyFindCache.set(cacheKey, result.data.journeys);
		}

		await fixJourneysFoundIfNeeded(result.data.journeys);

		for (const j of result.data.journeys) {
			void additionalJourneyInformation(
				`${j.journeyRelation.startCategory} ${j.journeyRelation.startJourneyNumber}`,
				j.journeyID,
				j.journeyRelation.startEvaNumber,
				new Date(j.journeyRelation.startTime),
			);
		}

		return result.data.journeys;
	} catch (e) {
		if (axios.isAxiosError(e) && e.response?.status === 401) {
			health.has401 = true;
		}
		return [];
	}
}

export async function findJourneyHafasCompatible(
	trainNumber: number,
	category?: string,
	date?: Date,
	onlyFv?: boolean,
): Promise<ParsedJourneyMatchResponse[]> {
	const risReuslt = await findJourney(trainNumber, category, date, onlyFv);

	return Promise.all(risReuslt.map(mapToParsedJourneyMatchResponse));
}

export async function getJourneyDetails(
	journeyId: string,
): Promise<JourneyEventBased | undefined> {
	try {
		if (!process.env.RIS_JOURNEYS_CACHE_DISABLED) {
			const cached = await journeyCache.get(journeyId);
			if (cached) {
				return cached;
			}
		}
		const r = await client.journeyEventBasedById({
			journeyID: journeyId,
			includeReferences: true,
		});

		if (r.data.events) {
			await Promise.all(
				r.data.events.map((e) => fixSingleStopIfNeeded(e.stopPlace)),
			);

			await fixSingleJourneyInfo(r.data.info);
		}

		if (!process.env.RIS_JOURNEYS_CACHE_DISABLED && r.data) {
			void journeyCache.set(journeyId, r.data);
		}

		return r.data;
	} catch (e) {
		if (axios.isAxiosError(e) && e.response?.status === 401) {
			health.has401 = true;
		}
		return undefined;
	}
}
