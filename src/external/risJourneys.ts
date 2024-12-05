import { JourneysApi, TransportType } from '@/external/generated/risJourneys';
import { Configuration as RisJourneysConfiguration } from '@/external/generated/risJourneys';
import type {
	JourneyEventBased,
	JourneyMatch,
	TransportPublic,
} from '@/external/generated/risJourneys';
import type { StopPlaceEmbedded } from '@/external/generated/risJourneysV2';
import { sortJourneys } from '@/external/risJourneysV2';
import { axiosUpstreamInterceptor } from '@/server/admin';
import { Cache, CacheDatabase } from '@/server/cache';
import { logger } from '@/server/logger';
import type { ParsedProduct } from '@/types/HAFAS';
import type { ParsedJourneyMatchResponse } from '@/types/HAFAS/JourneyMatch';
import type { RouteStop } from '@/types/routing';
import axios from 'axios';
import { differenceInHours, format, isEqual } from 'date-fns';

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

const axiosWithTimeout = axios.create({
	timeout: 6500,
});
axiosUpstreamInterceptor(axiosWithTimeout, 'ris-journeys');
const client = new JourneysApi(
	risJourneysConfiguration,
	undefined,
	axiosWithTimeout,
);

const longDistanceTypes: TransportType[] = [
	TransportType.HighSpeedTrain,
	TransportType.IntercityTrain,
];
const trainTypes: TransportType[] = [
	...longDistanceTypes,
	TransportType.InterRegionalTrain,
	TransportType.RegionalTrain,
	TransportType.CityTrain,
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

function findCategoryFilter(matches: JourneyMatch[], category?: string) {
	if (category) {
		const categoryFiltered = matches.filter(
			(j) => j.transport.category.toLowerCase() === category.toLowerCase(),
		);
		if (categoryFiltered.length) {
			return categoryFiltered;
		}
	}
	return matches;
}

function findAdministrationFilter(
	matches: JourneyMatch[],
	administration?: string,
) {
	if (administration) {
		const filtered = matches.filter(
			(j) => j.administrationID === administration,
		);
		if (filtered.length) {
			return filtered;
		}
	}
	return matches;
}

function findDateTimeFilter(matches: JourneyMatch[], dateTime: Date) {
	const filtered = matches.filter((m) => isEqual(m.date, dateTime));

	return filtered.length ? filtered : matches;
}

export async function findJourney(
	trainNumber: number,
	date: Date,
	category?: string,
	withOEV?: boolean,
	administration?: string,
) {
	const baseResult = await innerFindJourney(trainNumber, date, withOEV);
	const administrationFiltered = findAdministrationFilter(
		baseResult,
		administration,
	);
	const dateTimeFiltered = findDateTimeFilter(administrationFiltered, date);
	const categoryFiltered = findCategoryFilter(dateTimeFiltered, category);

	return categoryFiltered;
}

async function innerFindJourney(
	trainNumber: number,
	date: Date,
	withOEV?: boolean,
): Promise<JourneyMatch[]> {
	try {
		const isWithin20Hours = differenceInHours(date, Date.now()) <= 20;
		// some EVUs (Looking at you DB FV) might not be available for >20h, others are.
		if (!isWithin20Hours) {
			return [];
		}

		const cacheKey = `${trainNumber}|${format(date, 'yyyy-MM-dd')}|${withOEV ?? false}`;

		const cacheHit = await journeyFindCache.get(cacheKey);
		if (cacheHit) {
			return cacheHit;
		}

		const result = await client.find({
			number: trainNumber,
			// Kategorie ist schwierig, wir filtern quasi optional
			// category,
			date: format(date, 'yyyy-MM-dd'),
			transports: withOEV ? undefined : trainTypes,
		});

		result.data.journeys.sort(sortJourneys);

		if (isWithin20Hours) {
			void journeyFindCache.set(
				cacheKey,
				result.data.journeys,
				// empty resultsets are cached for one Hour. Sometimes journeys are found later
				result.data.journeys.length === 0 ? 'PT1H' : undefined,
			);
		}

		return result.data.journeys;
	} catch (e) {
		return [];
	}
}

export async function findJourneyHafasCompatible(
	trainNumber: number,
	date: Date,
	category?: string,
	withOEV?: boolean,
): Promise<ParsedJourneyMatchResponse[]> {
	const risResult = await findJourney(trainNumber, date, category, withOEV);

	return risResult.map(mapToParsedJourneyMatchResponse);
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
		return undefined;
	}
}
