import { bahnJourneyDetails } from '@/bahnde/journeyDetails/journeyDetails';
import { fullBahnDeOccupancy } from '@/bahnde/occupancy';
import type {
	JourneyEventBased,
	JourneyFindResult,
} from '@/external/generated/risJourneysV2';
import { findJourney } from '@/external/risJourneys';
import {
	findJourney as findJourneyV2,
	getJourneyDetails,
} from '@/external/risJourneysV2';
import { getOccupancy } from '@/server/coachSequence/occupancy';
import { getCategoryAndNumberFromName } from '@/server/journeys/journeyDetails';
import { journeyDetails } from '@/server/journeys/v2/journeyDetails';
import { logger } from '@/server/logger';
import { rpcAppRouter, rpcProcedure } from '@/server/rpc/base';
import type { JourneyResponse } from '@/types/journey';
import { TRPCError } from '@trpc/server';
import type { QueryProcedure } from '@trpc/server/unstable-core-do-not-import';
import { isBefore, subDays } from 'date-fns';
import { z } from 'zod';

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
		logger.debug('Using JourneysV2 (HAFAS compatible) find');
		return findJourneyV2(trainNumber, date, category, withOEV, administration);
	}
	logger.debug('Using JourneysV1 (HAFAS compatible) find');
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
	output: JourneyResponse | undefined | null;
}>;

type RawRPCJourney = QueryProcedure<{
	input: {
		journeyId: string;
	};
	output: JourneyEventBased | undefined;
}>;

type RawRPCJourneyFind = QueryProcedure<{
	input: {
		journeyNumber: number;
		date: Date;
		category?: string;
		administration?: string;
	};
	output: JourneyFindResult[];
}>;

export const journeysRpcRouter = rpcAppRouter({
	rawJourneyFind: rpcProcedure
		.meta({
			openapi: {
				method: 'GET',
				path: '/journeys/v1/find',
			},
		})
		.input(
			z.object({
				journeyNumber: z.number(),
				date: z.date(),
				category: z.string().optional(),
				administration: z.string().optional(),
			}),
		)
		.output(z.any())
		.query(({ input: { date, journeyNumber, administration, category } }) => {
			return findJourneyV1OrV2(
				journeyNumber,
				date,
				category,
				true,
				administration,
			);
		}) as RawRPCJourneyFind,
	rawJourneyByNumber: rpcProcedure
		.meta({
			openapi: {
				method: 'GET',
				path: '/journeys/v1/{journeyId}',
			},
		})
		.input(
			z.object({
				journeyId: z.string(),
			}),
		)
		.output(z.any())
		.query(async ({ input: { journeyId } }) => {
			const journey = await getJourneyDetails(journeyId);
			if (!journey) {
				throw new TRPCError({
					code: 'NOT_FOUND',
				});
			}
			return journey;
		}) as RawRPCJourney,
	find: rpcProcedure
		.input(
			z.object({
				trainNumber: z.number(),
				initialDepartureDate: z.date().optional(),
				evaNumberAlongRoute: z.string().optional(),
				withOEV: z.boolean().optional(),
				limit: z.number().optional(),
				category: z.string().optional(),
				administration: z.string().optional(),
			}),
		)
		.query(
			async ({
				input: {
					trainNumber,
					initialDepartureDate = new Date(),
					withOEV,
					limit,
					category,
					administration,
					evaNumberAlongRoute,
				},
			}) => {
				const possibleJourneys = await findJourneyV1OrV2(
					trainNumber,
					initialDepartureDate,
					category,
					withOEV,
					administration,
				);

				if (limit === 1 && evaNumberAlongRoute) {
					const allJourneys = (
						await Promise.all(
							possibleJourneys.map((j) => journeyDetails(j.journeyId)),
						)
					).filter(Boolean);
					const foundJourney = allJourneys.find((j) =>
						j.stops
							.map((s) => s.station.evaNumber)
							.includes(evaNumberAlongRoute),
					);

					const journeyFinds = possibleJourneys.filter(
						(j) => j.journeyId === foundJourney?.journeyId,
					);

					return journeyFinds;
				}
				return possibleJourneys.slice(0, limit);
			},
		),
	occupancy: rpcProcedure
		.input(z.string())
		.query(async ({ input: journeyId }) => {
			const transportsOccupancy = await getOccupancy(journeyId);
			if (transportsOccupancy) {
				return transportsOccupancy;
			}
			const bahnDeOccupancy = await fullBahnDeOccupancy(journeyId);
			if (bahnDeOccupancy) {
				return bahnDeOccupancy;
			}
			throw new TRPCError({
				code: 'NOT_FOUND',
			});
		}),
	detailsByJourneyId: rpcProcedure
		.input(z.string())
		.query(async ({ input: journeyId }) => {
			await new Promise((r) => setTimeout(r, 1000));
			if (journeyId === '404') {
				throw new TRPCError({
					code: 'NOT_FOUND',
				});
			}
			const details = await journeyDetails(journeyId);
			if (!details) {
				throw new TRPCError({
					code: 'NOT_FOUND',
				});
			}
			return details;
		}),
	detailsByJid: rpcProcedure.input(z.string()).query(async ({ input: jid }) => {
		const details = await bahnJourneyDetails(jid);
		if (!details) {
			throw new TRPCError({
				code: 'NOT_FOUND',
			});
		}
		return details;
	}),
	details: rpcProcedure
		.meta({
			openapi: {
				method: 'GET',
				path: '/hafas/v2/details/{trainName}',
			},
		})
		.input(
			z.object({
				trainName: z.string(),
				evaNumberAlongRoute: z.string().optional(),
				initialDepartureDate: z.date().optional(),
				jid: z.string().optional(),
				journeyId: z.string().optional(),
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
					jid,
					journeyId,
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
				const productDetails = getCategoryAndNumberFromName(trainName);
				if (!productDetails) {
					throw new TRPCError({
						code: 'NOT_FOUND',
					});
				}
				let hafasResult: JourneyResponse | undefined;
				if (jid && productDetails.trainNumber === 0) {
					// basierend auf Hafas versuchen, RIS::Journeys nur bei Bedarf
					hafasResult = await bahnJourneyDetails(jid);
					if (hafasResult) {
						if (hafasResult.train.number && hafasResult.train.number !== '0') {
							productDetails.trainNumber = Number.parseInt(
								hafasResult.train.number,
							);
						} else {
							return hafasResult;
						}
					}
				}
				const possibleJourneys = await findJourneyV1OrV2(
					productDetails.trainNumber,
					initialDepartureDate,
					productDetails.category,
					true,
					administration,
				);
				if (!possibleJourneys.length) {
					throw new TRPCError({
						code: 'NOT_FOUND',
					});
				}
				let foundJourney: JourneyResponse | undefined;

				if (evaNumberAlongRoute) {
					const allJourneys = (
						await Promise.all(
							possibleJourneys.map((j) => journeyDetails(j.journeyId)),
						)
					).filter(Boolean);
					foundJourney = allJourneys.find((j) =>
						j.stops
							.map((s) => s.station.evaNumber)
							.includes(evaNumberAlongRoute),
					);
				} else {
					foundJourney = await journeyDetails(possibleJourneys[0].journeyId);
				}
				if (!foundJourney) {
					throw new TRPCError({
						code: 'NOT_FOUND',
					});
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
