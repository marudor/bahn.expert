import { getAbfahrten } from '@/server/iris';
import { rpcAppRouter, rpcProcedure } from '@/server/rpc/base';
import { z } from 'zod';

export const irisRpcRouter = rpcAppRouter({
	abfahrten: rpcProcedure
		.input(
			z.object({
				evaNumber: z.string(),
				lookahead: z.number().default(150),
				lookbehind: z.number().default(0),
				startTime: z.date().optional(),
			}),
		)
		.query(({ input: { evaNumber, lookahead, lookbehind, startTime } }) => {
			return getAbfahrten(evaNumber, true, {
				lookahead,
				lookbehind,
				startTime,
			});
		}),
});
