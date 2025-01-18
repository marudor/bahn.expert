import { bahnRpcRouter } from '@/server/rpc/bahn';
import { rpcAppRouter } from '@/server/rpc/base';
import { boardsRpcRouter } from '@/server/rpc/boards';
import { coachSequenceRpcRouter } from '@/server/rpc/coachSequence';
import { connectionsRouter } from '@/server/rpc/connections';
import { hafasRpcRouter } from '@/server/rpc/hafas';
import { irisRpcRouter } from '@/server/rpc/iris';
import { journeysRpcRouter } from '@/server/rpc/journeys';
import { stopPlaceRpcRouter } from '@/server/rpc/stopPlace';
import { createHTTPHandler } from '@trpc/server/adapters/standalone';
import { createOpenApiHttpHandler } from 'trpc-openapi';
import { eventHandler } from 'vinxi/http';

const mainRouter = rpcAppRouter({
	coachSequence: coachSequenceRpcRouter,
	stopPlace: stopPlaceRpcRouter,
	iris: irisRpcRouter,
	hafas: hafasRpcRouter,
	journeys: journeysRpcRouter,
	connections: connectionsRouter,
	bahn: bahnRpcRouter,
	boards: boardsRpcRouter,
});

export type AppRouter = typeof mainRouter;

export const rpcHttpHandler = createOpenApiHttpHandler({
	router: mainRouter,
	onError: undefined,
	createContext: undefined,
	responseMeta: undefined,
	maxBodySize: undefined,
});

// const doc = generateOpenApiDocument(mainRouter, {
// 	title: 'bahn.expert',
// 	baseUrl: 'https://bahn.expert/api',
// 	version: '0.0.1',
// });
// fs.writeFileSync('./openapi.json', JSON.stringify(doc), 'utf8');

const rpcHandler = createHTTPHandler({
	router: mainRouter,
});

export default eventHandler((event) => {
	return rpcHandler(event.node.req, event.node.res);
});
