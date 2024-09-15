import { getAbfahrten } from '@/server/iris';
import { rpcAppRouter, rpcProcedure } from '@/server/rpc/base';
import type { AbfahrtenResult } from '@/types/iris';
import type { QueryProcedure } from '@trpc/server/unstable-core-do-not-import';
import { z } from 'zod';

export type AbfahrtenRPCQuery = QueryProcedure<{
	input: {
		evaNumber: string;
		lookahead?: number;
		lookbehind?: number;
		startTime?: Date;
	};
	output: AbfahrtenResult;
}>;

export const irisRpcRouter = rpcAppRouter({
	abfahrten: rpcProcedure
		.meta({
			openapi: {
				method: 'GET',
				path: '/api/iris/v2/abfahrten/{evaNumber}',
			},
		})
		.input(
			z.object({
				evaNumber: z.string(),
				lookahead: z.number().default(150),
				lookbehind: z.number().default(0),
				startTime: z.date().optional(),
			}),
		)
		.output(z.any())
		.query(({ input: { evaNumber, lookahead, lookbehind, startTime } }) => {
			return getAbfahrten(evaNumber, true, {
				lookahead,
				lookbehind,
				startTime,
			});
		}) as AbfahrtenRPCQuery,
});
