import { getRisConnections } from '@/external/risConnections';
import { rpcAppRouter, rpcProcedure } from '@/server/rpc/base';
import { z } from 'zod';

export const connectionsRouter = rpcAppRouter({
	connections: rpcProcedure
		.input(
			z.object({
				journeyId: z.string(),
				arrivalId: z.string(),
				evaNumber: z.string(),
			}),
		)
		.query(async ({ input: { journeyId, arrivalId, evaNumber } }) => {
			return getRisConnections(journeyId, arrivalId, evaNumber);
		}),
});
