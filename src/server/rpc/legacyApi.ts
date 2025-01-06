import { rpcHttpHandler } from '@/server/rpc';
import { eventHandler } from 'vinxi/http';

export default eventHandler((event) => {
	return rpcHttpHandler(event.node.req, event.node.res);
});
