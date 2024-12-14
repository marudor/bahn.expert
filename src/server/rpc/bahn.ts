import { routing } from '@/bahnde/routing/routing';
import { rpcAppRouter, rpcProcedure } from '@/server/rpc/base';
import { z } from 'zod';

const locationType = z.object({
	type: z.literal('stopPlace'),
	evaNumber: z.string(),
});

const viaType = z.object({
	evaNumber: z.string(),
	minChangeTime: z.number().optional(),
});

export const bahnRpcRouter = rpcAppRouter({
	routing: rpcProcedure
		.input(
			z.object({
				start: locationType,
				destination: locationType,
				via: z.array(viaType).optional(),
				time: z.date().optional(),
				transferTime: z.number().optional(),
				maxChanges: z.number().optional(),
				searchForDeparture: z.boolean().optional(),
				onlyRegional: z.boolean().optional(),
				ctxScr: z.string().optional(),
			}),
		)
		.query(async ({ input }) => {
			try {
				return await routing(input);
			} catch (e) {
				return e;
			}
		}),
});
