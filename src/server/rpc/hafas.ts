import { bahnDeOccupancy } from '@/bahnde/occupancy';
import { vrrOccupancy } from '@/server/StopPlace/vrrOccupancy';
import { getOccupancy } from '@/server/coachSequence/occupancy';
import { rpcAppRouter, rpcProcedure } from '@/server/rpc/base';
import type { RouteAuslastungWithSource } from '@/types/routing';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const hafasRpcRouter = rpcAppRouter({
	occupancy: rpcProcedure
		.input(
			z.object({
				trainNumber: z.string(),
				stopEva: z.string(),
				journeyId: z.string(),
			}),
		)
		.query(async ({ input: { trainNumber, stopEva, journeyId } }) => {
			const [foundOccupancy, foundVrrOccupancy, foundTransportsOccupancy] =
				await Promise.all([
					bahnDeOccupancy(journeyId, stopEva),
					vrrOccupancy(stopEva, trainNumber),
					getOccupancy(journeyId),
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
		}),
});
