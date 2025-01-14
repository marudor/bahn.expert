import { parse, stringify } from '@/devalue';
import { ApiRequestMetric } from '@/server/admin';
import { initTRPC } from '@trpc/server';
import { getHTTPStatusCodeFromError } from '@trpc/server/unstable-core-do-not-import';
import type { OpenApiMeta } from 'trpc-openapi';

const t = initTRPC
	.context<{
		skipBatch?: boolean;
	}>()
	.meta<OpenApiMeta>()
	.create({
		transformer: {
			deserialize: parse,
			serialize: stringify,
		},
	});

export const rpcAppRouter = t.router;
export const rpcProcedure = t.procedure.use(async (opts) => {
	const end = ApiRequestMetric?.startTimer()!;
	const result = await opts.next();
	const metricOptions: Parameters<typeof end>[number] = {
		route: opts.path,
		status: 200,
	};
	if (!result.ok) {
		metricOptions.status = getHTTPStatusCodeFromError(result.error);
	}
	end?.(metricOptions);

	return result;
});
