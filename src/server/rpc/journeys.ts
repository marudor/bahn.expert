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
import type { QueryProcedure } from '@trpc/server/unstable-core-do-not-import';
import { isBefore, subDays } from 'date-fns';
import { z } from 'zod';

function findV1OrV2HafasCompatible(
	trainNumber: number,
	date: Date,
	category?: string,
	withOEV?: boolean,
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
		return findJourneyHafasCompatibleV2(trainNumber, date, category, withOEV);
	}
	logger.debug('Using JourneysV1 (HAFAS compatible) find');
	return findJourneyHafasCompatible(trainNumber, date, category, withOEV);
}

function findJourneyV1OrV2(
	trainNumber: number,
	date: Date,
	category?: string,
	withOEV?: boolean,
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
		return findJourneyV2(trainNumber, date, category, withOEV, administration);
	}
	logger.debug('Using JourneysV1 find');
	return findJourney(trainNumber, date, category, withOEV, administration);
}

export type JourneyRPCQuery = QueryProcedure<{
	input: {
		trainName: string;
		evaNumberAlongRoute?: string;
		initialDepartureDate?: Date;
		journeyId?: string;
		jid?: string;
		administration?: string;
	};
	output: ParsedSearchOnTripResponse | undefined | null;
}>;

export const journeysRpcRouter = rpcAppRouter({
	findByNumber: rpcProcedure
		.input(
			z.object({
				trainNumber: z.number(),
				initialDepartureDate: z.date().optional(),
				initialEvaNumber: z.string().optional(),
				withOEV: z.boolean().optional(),
				limit: z.number().optional(),
				category: z.string().optional(),
			}),
		)
		.query(
			async ({
				input: {
					trainNumber,
					initialDepartureDate = new Date(),
					initialEvaNumber,
					withOEV,
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
						initialDepartureDate,
						category,
						withOEV,
					);
				}

				const trainName = trainNumber.toString();
				const hafasFallback = () =>
					enrichedJourneyMatch({
						onlyRT: true,
						jnyFltrL: withOEV
							? undefined
							: [
									{
										mode: 'INC',
										type: 'PROD',
										value: '31',
									},
								],
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
		.meta({
			openapi: {
				method: 'GET',
				path: '/api/hafas/v2/details/{trainName}',
			},
		})
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
		.output(z.any())
		.query(
			async ({
				input: {
					trainName,
					evaNumberAlongRoute,
					initialDepartureDate = new Date(),
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
				let hafasResult: ParsedSearchOnTripResponse | undefined;
				if (jid) {
					hafasResult = await hafasFallback();
				}
				const possibleJourneys = await findJourneyV1OrV2(
					productDetails.trainNumber,
					initialDepartureDate,
					productDetails.category,
					false,
					administration,
				);
				if (!possibleJourneys.length) {
					return hafasFallback();
				}
				let foundJourney: ParsedSearchOnTripResponse | undefined;

				if (evaNumberAlongRoute) {
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

				if (hafasResult) {
					if (
						hafasResult.train.admin !== foundJourney.train.admin ||
						hafasResult.train.type !== foundJourney.train.type
					) {
						return hafasResult;
					}
				}

				return foundJourney;
			},
		) as JourneyRPCQuery,
});
