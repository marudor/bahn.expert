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
				lastArrivalEva: z.string().optional(),
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
					lastArrivalEva,
				},
			}) => {
				try {
					const sequence = await coachSequence(
						trainNumber.toString(),
						departure,
						evaNumber,
						initialDeparture,
						category,
						lastArrivalEva,
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
});
