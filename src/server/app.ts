import http from 'node:http';
import path from 'node:path';
import Axios from 'axios';
import Koa from 'koa';
import type { Context, Middleware } from 'koa';
import KoaBodyparser from 'koa-bodyparser';
import koaStatic from 'koa-static';
import createAdmin from './admin';
import { blockMiddleware } from './blockMiddleware';
import { middlewares } from './logger';
import storageMiddleware from './middleware/storageMiddleware';

function hotHelper(getMiddleware: () => Middleware) {
	if (process.env.NODE_ENV === 'production') {
		return getMiddleware();
	}

	return (ctx: Context, next: () => Promise<any>) => getMiddleware()(ctx, next);
}

export function createApp(): Koa {
	const app = new Koa();

	app.use(blockMiddleware);

	let serverRender = require('./render').default;
	let seoController = require('./seo').default;
	let errorHandler = require('./errorHandler').default;
	let normalizePathMiddleware = require('./middleware/normalizePath').default;
	let rpcRouter = require('./rpc').rpcRouter;
	let rpcHtppRouter = require('./rpc').rpcHttpRouter;

	let devPromise = Promise.resolve();

	const distFolder = 'dist';

	if (
		process.env.NODE_ENV !== 'test' &&
		process.env.NODE_ENV !== 'production'
	) {
		devPromise = require('./middleware/webpackDev')
			.default(app)
			.then(() => {
				app.use((ctx, next) => {
					normalizePathMiddleware =
						require('./middleware/normalizePath').default;
					errorHandler = require('./errorHandler').default;
					serverRender = require('./render').default;
					seoController = require('./seo').default;
					rpcRouter = require('./rpc').rpcRouter;
					rpcHtppRouter = require('./rpc').rpcHttpRouter;
					ctx.loadableStats = JSON.parse(
						ctx.state.webpack.devMiddleware.outputFileSystem.readFileSync(
							path.resolve(`${distFolder}/client/loadable-stats.json`),
						),
					);

					return next();
				});
			});
	}

	void devPromise.then(() => {
		app.use(hotHelper(() => errorHandler));
		app.use(hotHelper(() => normalizePathMiddleware()));
		app.use(storageMiddleware);
		for (const m of middlewares) app.use(m);
		app.use(KoaBodyparser());

		app.use(hotHelper(() => rpcRouter));

		app.use(hotHelper(() => rpcHtppRouter));

		app.use(
			koaStatic(
				path.resolve(
					process.env.NODE_ENV === 'production'
						? `${distFolder}/client`
						: 'public',
				),
				{
					maxAge: 31536000000, // 1 year
				},
			),
		);

		app.use((ctx, next) => {
			if (
				ctx.path.endsWith('.js') ||
				ctx.path.endsWith('.css') ||
				ctx.path.endsWith('.map')
			) {
				return;
			}
			if (ctx.url.startsWith('/api') || ctx.url.startsWith('/WRSheets')) {
				return;
			}

			return next();
		});

		app.use(hotHelper(() => seoController));

		if (process.env.NODE_ENV === 'production') {
			const loadableStats = require(
				path.resolve(`${distFolder}/client/loadable-stats.json`),
			);

			app.use((ctx, next) => {
				ctx.loadableStats = loadableStats;

				return next();
			});
		}

		app.use(hotHelper(() => serverRender));
	});

	return app;
}

export default (): http.Server => {
	const port = process.env.WEB_PORT || 9042;

	const server = http.createServer();

	Axios.defaults.baseURL = `http://localhost:${port}`;

	const app = createApp();

	server.addListener('request', app.callback());
	server.listen(port);
	// istanbul ignore next
	if (process.env.NODE_ENV !== 'production') {
		console.log('running in DEV mode!');
	}
	createAdmin();

	return server;
};
