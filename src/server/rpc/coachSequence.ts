import { getVehicleLayout } from '@/external/risMaps';
import { getJourneyOccupancy } from '@/external/risTransports/occupancy';
import { coachSequence } from '@/server/coachSequence';
import { getPlannedSequence } from '@/server/coachSequence/DB/plannedSequence';
import { getTrainRunsByDate } from '@/server/coachSequence/DB/trainRuns';
import { rpcAppRouter, rpcProcedure } from '@/server/rpc/base';
import {
	AvailableBRConstant,
	AvailableIdentifierConstant,
} from '@/types/coachSequence';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const coachSequenceRpcRouter = rpcAppRouter({
	sequence: rpcProcedure
		.input(
			z.object({
				trainNumber: z.number(),
				departure: z.date(),
				evaNumber: z.string().optional(),
				initialDeparture: z.date().optional(),
				category: z.string().optional(),
				administration: z.string().optional(),
			}),
		)
		.query(
			async ({
				input: {
					trainNumber,
					departure,
					evaNumber,
					initialDeparture,
					category,
					administration,
				},
			}) => {
				try {
					const sequence = await coachSequence(
						trainNumber.toString(),
						departure,
						evaNumber,
						initialDeparture,
						category,
						administration,
					);
					if (sequence) return sequence;
				} catch {
					// we ignore this
				}

				if (trainNumber < 10000 && evaNumber) {
					const plannedSequence = await getPlannedSequence(
						trainNumber,
						initialDeparture ?? departure,
						evaNumber,
					);
					if (plannedSequence) {
						return plannedSequence;
					}
				}

				throw new TRPCError({
					code: 'NOT_FOUND',
				});
			},
		),
	trainRuns: rpcProcedure
		.input(
			z.object({
				date: z.date(),
				baureihen: z.array(z.enum(AvailableBRConstant)).optional(),
				identifier: z.array(z.enum(AvailableIdentifierConstant)).optional(),
				stopsAt: z.array(z.string()).optional(),
			}),
		)
		.query(({ input: { date, baureihen, identifier, stopsAt } }) => {
			return getTrainRunsByDate(date, baureihen, identifier, stopsAt);
		}),
	vehicleLayout: rpcProcedure.input(z.string()).query(({ input }) => {
		return getVehicleLayout(input);
	}),
	occupancy: rpcProcedure
		.input(
			z.object({
				journeyId: z.string(),
			}),
		)
		.query(({ input: { journeyId } }) => {
			return getJourneyOccupancy({
				journeyId,
			});
		}),
});
