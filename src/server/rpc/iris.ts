import { getAbfahrten } from '@/server/iris';
import { rpcAppRouter, rpcProcedure } from '@/server/rpc/base';
import { z } from 'zod';

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
		}),
});
