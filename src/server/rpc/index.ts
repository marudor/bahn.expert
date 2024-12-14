import { bahnRpcRouter } from '@/server/rpc/bahn';
import { rpcAppRouter } from '@/server/rpc/base';
import { coachSequenceRpcRouter } from '@/server/rpc/coachSequence';
import { connectionsRouter } from '@/server/rpc/connections';
import { hafasRpcRouter } from '@/server/rpc/hafas';
import { irisRpcRouter } from '@/server/rpc/iris';
import { journeysRpcRouter } from '@/server/rpc/journeys';
import { stopPlaceRpcRouter } from '@/server/rpc/stopPlace';
import type { Context, Next } from 'koa';
import { createKoaMiddleware } from 'trpc-koa-adapter';
import { createOpenApiHttpHandler } from 'trpc-openapi';

const mainRouter = rpcAppRouter({
	coachSequence: coachSequenceRpcRouter,
	stopPlace: stopPlaceRpcRouter,
	iris: irisRpcRouter,
	hafas: hafasRpcRouter,
	journeys: journeysRpcRouter,
	connections: connectionsRouter,
	bahn: bahnRpcRouter,
});

export type AppRouter = typeof mainRouter;

export const rpcRouter = createKoaMiddleware({
	router: mainRouter,
	prefix: '/rpc',
});

const rawRpcHttpRouter = createOpenApiHttpHandler({
	router: mainRouter,
});
export const rpcHttpRouter = async (ctx: Context, next: Next) => {
	if (ctx.url.startsWith('/api')) {
		await rawRpcHttpRouter(ctx.req, ctx.res);
	}
	return next();
};
