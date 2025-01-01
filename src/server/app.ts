import http from 'node:http';
import path from 'node:path';
import Axios from 'axios';
import Koa from 'koa';
import type { Context, Middleware } from 'koa';
import KoaBodyparser from 'koa-bodyparser';
import koaConnect from 'koa-connect';
import koaStatic from 'koa-static';
import createAdmin from './admin';
import { blockMiddleware } from './blockMiddleware';
import { middlewares } from './logger';
import storageMiddleware from './middleware/storageMiddleware';

const isProd = process.env.NODE_ENV === 'production';

function hotHelper(getMiddleware: () => Middleware) {
	if (process.env.NODE_ENV === 'production') {
		return getMiddleware();
	}

	return (ctx: Context, next: () => Promise<any>) => getMiddleware()(ctx, next);
}

export async function createApp(): Promise<Koa> {
	let vite: import('vite').ViteDevServer;

	const app = new Koa();
	app.use(blockMiddleware);

	if (!isProd) {
		vite = await (await import('vite')).createServer({
			root: path.resolve(__dirname, '../..'),
			server: {
				middlewareMode: true,
				watch: {
					usePolling: true,
					interval: 100,
				},
				hmr: {},
			},
			appType: 'custom',
		});

		app.use(koaConnect(vite.middlewares));
	}

	let seoController = require('./seo').default;
	let errorHandler = require('./errorHandler').default;
	let normalizePathMiddleware = require('./middleware/normalizePath').default;
	let rpcRouter = require('./rpc').rpcRouter;
	let rpcHtppRouter = require('./rpc').rpcHttpRouter;

	const distFolder = 'dist';

	if (
		process.env.NODE_ENV !== 'test' &&
		process.env.NODE_ENV !== 'production'
	) {
		app.use((_, next) => {
			normalizePathMiddleware = require('./middleware/normalizePath').default;
			errorHandler = require('./errorHandler').default;
			seoController = require('./seo').default;
			rpcRouter = require('./rpc').rpcRouter;
			rpcHtppRouter = require('./rpc').rpcHttpRouter;

			return next();
		});
	}

	app.use(hotHelper(() => errorHandler));
	app.use(hotHelper(() => normalizePathMiddleware()));
	app.use(storageMiddleware);
	for (const m of middlewares) app.use(m);
	app.use(KoaBodyparser());

	app.use(hotHelper(() => rpcRouter));

	app.use(hotHelper(() => rpcHtppRouter));

	app.use(
		koaStatic(path.resolve(isProd ? `${distFolder}/client` : 'public'), {
			maxAge: 31536000000, // 1 year
		}),
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

	app.use(async (ctx) => {
		try {
			const url = ctx.originalUrl;

			const entry = await (async () => {
				if (isProd) {
					return {};
				}
				return vite.ssrLoadModule('/src/server/render.tsx', {
					fixStacktrace: true,
				});
			})();

			console.info('Rendering: ', url, '...');
			await entry.render({ ctx });
		} catch (e) {
			!isProd && vite.ssrFixStacktrace(e);
			console.info(e.stack);
			ctx.status = 500;
			ctx.body = e.stack;
		}
	});

	return app;
}

export default async (): Promise<http.Server> => {
	const port = process.env.WEB_PORT || 9042;

	const server = http.createServer();

	Axios.defaults.baseURL = `http://localhost:${port}`;

	const app = await createApp();

	server.addListener('request', app.callback());
	server.listen(port);
	if (process.env.NODE_ENV !== 'production') {
		// biome-ignore lint/suspicious/noConsoleLog: debug
		console.log('running in DEV mode!');
	}
	createAdmin();

	return server;
};
