import {
	findJourney,
	findJourneyHafasCompatible,
} from '@/external/risJourneys';
import {
	findJourneyHafasCompatible as findJourneyHafasCompatibleV2,
	findJourney as findJourneyV2,
} from '@/external/risJourneysV2';
import Detail from '@/server/HAFAS/Detail';
import { enrichedJourneyMatch } from '@/server/HAFAS/JourneyMatch';
import { getCategoryAndNumberFromName } from '@/server/journeys/journeyDetails';
import { journeyDetails } from '@/server/journeys/v2/journeyDetails';
import { logger } from '@/server/logger';
import { rpcAppRouter, rpcProcedure } from '@/server/rpc/base';
import type { ParsedJourneyMatchResponse } from '@/types/HAFAS/JourneyMatch';
import type { ParsedSearchOnTripResponse } from '@/types/HAFAS/SearchOnTrip';
import { TRPCError } from '@trpc/server';
import { isBefore, subDays } from 'date-fns';
import { z } from 'zod';

function findV1OrV2HafasCompatible(
	trainNumber: number,
	category?: string,
	date?: Date,
	onlyFv?: boolean,
) {
	let useV2 = true;
	if (date) {
		const fourDaysAgo = subDays(new Date(), 4);
		const olderThan4Days = isBefore(date, fourDaysAgo);
		if (olderThan4Days) {
			useV2 = false;
		}
	}

	if (useV2) {
		logger.debug('Using JourneysV2 (HAFAS compatible) find');
		return findJourneyHafasCompatibleV2(trainNumber, category, date, onlyFv);
	}
	logger.debug('Using JourneysV1 (HAFAS compatible) find');
	return findJourneyHafasCompatible(trainNumber, category, date, onlyFv);
}

function findJoureyV1OrV2(
	trainNumber: number,
	category?: string,
	date?: Date,
	onlyFv?: boolean,
	originEvaNumber?: string,
	administration?: string,
) {
	let useV2 = true;
	if (date) {
		const fourDaysAgo = subDays(new Date(), 4);
		const olderThan4Days = isBefore(date, fourDaysAgo);
		if (olderThan4Days) {
			useV2 = false;
		}
	}
	if (useV2) {
		logger.debug('Using JourneysV2 find');
		return findJourneyV2(
			trainNumber,
			category,
			date,
			onlyFv,
			originEvaNumber,
			administration,
		);
	}
	logger.debug('Using JourneysV1 find');
	return findJourney(
		trainNumber,
		category,
		date,
		onlyFv,
		originEvaNumber,
		administration,
	);
}

export const journeysRpcRouter = rpcAppRouter({
	findByNumber: rpcProcedure
		.input(
			z.object({
				trainNumber: z.number(),
				initialDepartureDate: z.date().optional(),
				initialEvaNumber: z.string().optional(),
				filtered: z.boolean().optional(),
				limit: z.number().optional(),
				category: z.string().optional(),
			}),
		)
		.query(
			async ({
				input: {
					trainNumber,
					initialDepartureDate,
					initialEvaNumber,
					filtered,
					limit,
					category,
				},
			}) => {
				let risPromise: Promise<ParsedJourneyMatchResponse[]> = Promise.resolve(
					[],
				);
				if (trainNumber) {
					risPromise = findV1OrV2HafasCompatible(
						trainNumber,
						category,
						initialDepartureDate,
						filtered,
					);
				}

				const trainName = trainNumber.toString();
				const hafasFallback = () =>
					enrichedJourneyMatch({
						onlyRT: true,
						jnyFltrL: filtered
							? [
									{
										mode: 'INC',
										type: 'PROD',
										value: '7',
									},
								]
							: undefined,
						trainName,
						initialDepartureDate,
						limit,
					});

				const risResult = await risPromise;

				let result = risResult.length ? risResult : await hafasFallback();
				if (initialEvaNumber) {
					result = result.filter(
						(r) => r.firstStop.station.evaNumber === initialEvaNumber,
					);
				}

				return result.slice(0, limit);
			},
		),
	details: rpcProcedure
		.input(
			z.object({
				trainName: z.string(),
				evaNumberAlongRoute: z.string().optional(),
				initialDepartureDate: z.date().optional(),
				journeyId: z.string().optional(),
				jid: z.string().optional(),
				administration: z.string().optional(),
			}),
		)
		.query(
			async ({
				input: {
					trainName,
					evaNumberAlongRoute,
					initialDepartureDate,
					journeyId,
					jid,
					administration,
				},
			}) => {
				if (journeyId) {
					const journey = await journeyDetails(journeyId);
					if (!journey) {
						throw new TRPCError({
							code: 'NOT_FOUND',
						});
					}
					return journey;
				}
				const hafasFallback = async () => {
					const hafasResult = await Detail(
						trainName,
						undefined,
						evaNumberAlongRoute,
						initialDepartureDate,
						undefined,
						undefined,
						administration,
						jid,
					);
					if (!hafasResult) {
						throw new TRPCError({
							code: 'NOT_FOUND',
						});
					}
					return hafasResult;
				};
				const productDetails = getCategoryAndNumberFromName(trainName);
				if (!productDetails) {
					return hafasFallback();
				}
				const possibleJourneys = await findJoureyV1OrV2(
					productDetails.trainNumber,
					productDetails.category,
					initialDepartureDate,
					false,
					undefined,
					administration,
				);
				if (!possibleJourneys.length) {
					return hafasFallback();
				}
				let foundJourney: ParsedSearchOnTripResponse | undefined;
				const firstJourneyTransport =
					'transport' in possibleJourneys[0]
						? possibleJourneys[0].transport
						: possibleJourneys[0].info.transportAtStart;

				if (
					(possibleJourneys.length > 1 ||
						(productDetails.category &&
							firstJourneyTransport.category !== productDetails.category)) &&
					evaNumberAlongRoute
				) {
					const allJourneys = (
						await Promise.all(
							possibleJourneys.map((j) => journeyDetails(j.journeyID)),
						)
					).filter(Boolean);
					foundJourney = allJourneys.find((j) =>
						j.stops
							.map((s) => s.station.evaNumber)
							.includes(evaNumberAlongRoute),
					);
				} else {
					foundJourney = await journeyDetails(possibleJourneys[0].journeyID);
				}
				if (!foundJourney) {
					return hafasFallback();
				}

				return foundJourney;
			},
		),
});
