import { JourneysApi, TransportType } from '@/external/generated/risJourneys';
import { Configuration as RisJourneysConfiguration } from '@/external/generated/risJourneys';
import type {
	JourneyEventBased,
	JourneyMatch,
	TransportPublic,
} from '@/external/generated/risJourneys';
import type { StopPlaceEmbedded } from '@/external/generated/risJourneysV2';
import { axiosUpstreamInterceptor } from '@/server/admin';
import { Cache, CacheDatabase } from '@/server/cache';
import { additionalJourneyInformation } from '@/server/journeys/additionalJourneyInformation';
import { logger } from '@/server/logger';
import type { ParsedProduct } from '@/types/HAFAS';
import type { ParsedJourneyMatchResponse } from '@/types/HAFAS/JourneyMatch';
import type { RouteStop } from '@/types/routing';
import axios from 'axios';
import { differenceInHours, format } from 'date-fns';

const risJourneysConfiguration = new RisJourneysConfiguration({
	basePath: process.env.RIS_JOURNEYS_URL,
	baseOptions: {
		headers: {
			'DB-Api-Key': process.env.RIS_JOURNEYS_CLIENT_SECRET,
			'DB-Client-Id': process.env.RIS_JOURNEYS_CLIENT_ID,
		},
	},
});

const journeyFindCache = new Cache<JourneyMatch[]>(CacheDatabase.JourneyFind);

const journeyCache = new Cache<JourneyEventBased>(CacheDatabase.Journey);

logger.info(
	`using ${process.env.RIS_JOURNEYS_USER_AGENT} as RIS::Journeys UserAgent`,
);

export const health = {
	has401: false,
};

const axiosWithTimeout = axios.create({
	timeout: 6500,
});
axiosUpstreamInterceptor(axiosWithTimeout, 'ris-journeys');
const client = new JourneysApi(risJourneysConfiguration);

const longDistanceTypes: TransportType[] = [
	TransportType.HighSpeedTrain,
	TransportType.IntercityTrain,
];

const mapTransportToTrain = (transport: TransportPublic): ParsedProduct => ({
	name: `${transport.category} ${
		longDistanceTypes.includes(transport.type)
			? transport.number
			: transport.line || transport.number
	}`,
	line: transport.line,
	type: transport.category,
	number: `${transport.number}`,
	transportType: transport.type,
});

const mapStationShortToRouteStops = (
	station: StopPlaceEmbedded,
): RouteStop => ({
	station,
});

function mapToParsedJourneyMatchResponse(
	journeyMatch: JourneyMatch,
): ParsedJourneyMatchResponse {
	return {
		// Technically wrong!
		jid: journeyMatch.journeyID,
		train: mapTransportToTrain(journeyMatch.transport),
		stops: [],
		firstStop: mapStationShortToRouteStops(journeyMatch.originSchedule),
		lastStop: mapStationShortToRouteStops(journeyMatch.destinationSchedule),
	};
}
export async function findJourney(
	trainNumber: number,
	category?: string,
	date?: Date,
	onlyFv?: boolean,
	originEvaNumber?: string,
	administration?: string,
): Promise<JourneyMatch[]> {
	try {
		const isWithin20Hours = date && differenceInHours(date, Date.now()) <= 20;
		// some EVUs (Looking at you DB FV) might not be available for >20h, others are.
		if (!isWithin20Hours) {
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
			number: trainNumber,
			// Kategorie ist schwierig, wir filtern quasi optional
			// category,
			date: date && format(date, 'yyyy-MM-dd'),
			transports: onlyFv ? longDistanceTypes : undefined,
			originEvaNumber,
			administrationID: administration,
		});

		if (category) {
			const categoryFiltered = result.data.journeys.filter(
				(j) => j.transport.category.toLowerCase() === category.toLowerCase(),
			);
			if (categoryFiltered.length) {
				result.data.journeys = categoryFiltered;
			}
		}

		if (isWithin20Hours) {
			void journeyFindCache.set(
				cacheKey,
				result.data.journeys,
				// empty resultsets are cached for one Hour. Sometimes journeys are found later
				result.data.journeys.length === 0 ? 'PT1H' : undefined,
			);
		}

		for (const j of result.data.journeys) {
			void additionalJourneyInformation(
				`${j.transport.category} ${j.transport.number}`,
				j.journeyID,
				j.originSchedule.evaNumber,
				new Date(j.date),
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

	return risReuslt.map(mapToParsedJourneyMatchResponse);
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
			includeJourneyReferences: true,
			includeCanceled: true,
		});

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
