import type { IncomingMessage } from 'node:http';
import { rpcAppRouter } from '@/server/rpc/base';
import { coachSequenceRpcRouter } from '@/server/rpc/coachSequence';
import { connectionsRouter } from '@/server/rpc/connections';
import { hafasRpcRouter } from '@/server/rpc/hafas';
import { irisRpcRouter } from '@/server/rpc/iris';
import { journeysRpcRouter } from '@/server/rpc/journeys';
import { stopPlaceRpcRouter } from '@/server/rpc/stopPlace';
import type { NodeHTTPResponse } from '@trpc/server/adapters/node-http';
import type { Context, Next } from 'koa';
import { createKoaMiddleware } from 'trpc-koa-adapter';
import { createOpenApiHttpHandler } from 'trpc-openapi';

const mainRouter = rpcAppRouter({
	coachSequences: coachSequenceRpcRouter,
	stopPlace: stopPlaceRpcRouter,
	iris: irisRpcRouter,
	hafas: hafasRpcRouter,
	journey: journeysRpcRouter,
	connections: connectionsRouter,
});

export type AppRouter = typeof mainRouter;

const middleware =
	process.env.NODE_ENV === 'production' && !process.env.TEST_RUN
		? (
				req: IncomingMessage,
				res: NodeHTTPResponse,
				next: (err?: any) => any,
			) => {
				const referer = req.headers.referer;
				if (
					!referer?.startsWith('https://bahn.expert') ||
					!referer?.startsWith('https://beta.bahn.expert')
				) {
					res.statusCode = 401;
					res.end();
				} else {
					return next();
				}
			}
		: undefined;

export const rpcRouter = createKoaMiddleware({
	router: mainRouter,
	prefix: '/rpc',
	middleware,
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
