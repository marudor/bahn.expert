import { rpcAppRouter } from '@/server/rpc/base';
import { coachSequenceRpcRouter } from '@/server/rpc/coachSequence';
import { hafasRpcRouter } from '@/server/rpc/hafas';
import { irisRpcRouter } from '@/server/rpc/iris';
import { journeysRpcRouter } from '@/server/rpc/journeys';
import { stopPlaceRpcRouter } from '@/server/rpc/stopPlace';
import { createKoaMiddleware } from 'trpc-koa-adapter';

const mainRouter = rpcAppRouter({
	coachSequence: coachSequenceRpcRouter,
	stopPlace: stopPlaceRpcRouter,
	iris: irisRpcRouter,
	hafas: hafasRpcRouter,
	journeys: journeysRpcRouter,
});

export type AppRouter = typeof mainRouter;

export const rpcRouter = createKoaMiddleware({
	router: mainRouter,
	prefix: '/rpc',
});
