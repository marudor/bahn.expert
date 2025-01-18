import type { BoardPublicDeparture } from '@/external/generated/risBoards';
import { rawRisDepartures } from '@/external/risBoards';
import { rpcAppRouter, rpcProcedure } from '@/server/rpc/base';
import type { QueryProcedure } from '@trpc/server/unstable-core-do-not-import';
import { z } from 'zod';

type RawRisDeparturesProcedure = QueryProcedure<{
	input: {
		evaNumber: string;
		timeStart: Date;
		timeEnd: Date;
	};
	output: BoardPublicDeparture;
}>;

export const boardsRpcRouter = rpcAppRouter({
	rawDepartures: rpcProcedure
		.meta({
			openapi: {
				method: 'GET',
				path: '/boards/v1/departures/{evaNumber}',
			},
		})
		.input(
			z.object({
				evaNumber: z.string(),
				timeStart: z.date(),
				timeEnd: z.date(),
			}),
		)
		.output(z.any())
		.query(({ input: { evaNumber, timeStart, timeEnd } }) => {
			return rawRisDepartures(evaNumber, timeStart, timeEnd);
		}) as RawRisDeparturesProcedure,
});
