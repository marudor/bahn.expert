import childProcess from 'node:child_process';
import path from 'node:path';
import chokidar from 'chokidar';
import type Koa from 'koa';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from '../../../webpack.config.cjs';

// @ts-expect-error typing wrong
const compiler = webpack(webpackConfig);
const clientRegexp = /src\/client/;
const serverRegexp =
	/src\/(?!(client|server\/logger|server\/HAFAS\/HimSearch))/;
export default function webpackDev(koa: Koa): Promise<unknown> {
	// Do "hot-reloading" of react stuff on the server
	// Throw away the cached client modules and let them be re-required next time
	// see https://github.com/glenjamin/ultimate-hot-reloading-example
	compiler.hooks.done.tap('CacheBusting', () => {
		console.log('Clearing webpack module cache from server');
		for (const id of Object.keys(require.cache)) {
			if (clientRegexp.test(id)) {
				delete require.cache[id];
			}
		}
		delete require.cache[path.resolve('src/server/render.tsx')];
	});
	const watcher = chokidar.watch(path.resolve('./src/**'));

	watcher.on('change', (file: string[]) => {
		if (file.includes('src/client')) return;
		if (file.includes('src/server/API/controller/')) {
			console.log('Rebuilding Routes & doc');
			childProcess.exec('pnpm doc:build', (err, _, stderr) => {
				if (err) {
					console.error(stderr);
				} else {
					console.log('Done rebuilding');
				}
			});
		}
		for (const id of Object.keys(require.cache)) {
			if (!id.includes('/node_modules/') && serverRegexp.test(id)) {
				delete require.cache[id];
			}
		}
	});

	return new Promise<void>((resolve) => {
		const middleware = webpackMiddleware.koaWrapper(compiler, {
			serverSideRender: true,
			publicPath: '/',
		});
		const hotMiddleware = webpackHotMiddleware(compiler);

		koa.use(middleware);
		koa.use((ctx, next) => {
			if (ctx.status === 200 && typeof Buffer.isBuffer(ctx.body)) {
				return;
			}
			return new Promise((resolve, reject) => {
				hotMiddleware(ctx.req, ctx.res, (err) => {
					if (err) reject(err);
					else resolve(next());
				});
			});
		});

		resolve();
	});
}
