import { bahnDeOccupancy } from '@/bahnde/occupancy';
import { vrrOccupancy } from '@/server/StopPlace/vrrOccupancy';
import { getOccupancy } from '@/server/coachSequence/occupancy';
import { additionalJourneyInformation } from '@/server/journeys/additionalJourneyInformation';
import { rpcAppRouter, rpcProcedure } from '@/server/rpc/base';
import type { RouteAuslastungWithSource } from '@/types/routing';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const hafasRpcRouter = rpcAppRouter({
	occupancy: rpcProcedure
		.input(
			z.object({
				start: z.string(),
				destination: z.string(),
				plannedDepartureTime: z.date().optional(),
				trainNumber: z.string(),
				stopEva: z.string(),
				journeyId: z.string().optional(),
			}),
		)
		.query(
			async ({
				input: {
					start,
					destination,
					plannedDepartureTime,
					trainNumber,
					stopEva,
					journeyId,
				},
			}) => {
				const [foundOccupancy, foundVrrOccupancy, foundTransportsOccupancy] =
					await Promise.all([
						plannedDepartureTime &&
							bahnDeOccupancy(
								start,
								destination,
								trainNumber,
								plannedDepartureTime,
								stopEva,
							),
						vrrOccupancy(stopEva, trainNumber),
						journeyId ? getOccupancy(journeyId) : undefined,
					]);

				if (foundTransportsOccupancy?.[stopEva]) {
					return {
						source: 'Transports',
						occupancy: foundTransportsOccupancy[stopEva],
					} as RouteAuslastungWithSource;
				}

				if (foundOccupancy) {
					return {
						source: 'HAFAS',
						occupancy: foundOccupancy,
					} as RouteAuslastungWithSource;
				}
				if (foundVrrOccupancy) {
					return {
						source: 'VRR',
						occupancy: foundVrrOccupancy,
					} as RouteAuslastungWithSource;
				}

				throw new TRPCError({
					code: 'NOT_FOUND',
				});
			},
		),
	additionalInformation: rpcProcedure
		.input(
			z.object({
				trainName: z.string(),
				journeyId: z.string(),
				evaNumberAlongRoute: z.string().optional(),
				initialDepartureDate: z.date().optional(),
			}),
		)
		.query(
			async ({
				input: {
					trainName,
					journeyId,
					evaNumberAlongRoute,
					initialDepartureDate,
				},
			}) => {
				const additionalInformation = await additionalJourneyInformation(
					trainName,
					journeyId,
					evaNumberAlongRoute,
					initialDepartureDate,
				);

				if (additionalInformation) {
					return additionalInformation;
				}

				throw new TRPCError({
					code: 'NOT_FOUND',
				});
			},
		),
});
