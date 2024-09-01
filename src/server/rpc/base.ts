import { parse, stringify } from '@/devalue';
import { initTRPC } from '@trpc/server';

const t = initTRPC.create({
	transformer: {
		deserialize: parse,
		serialize: stringify,
	},
});

export const rpcAppRouter = t.router;
export const rpcProcedure = t.procedure;
