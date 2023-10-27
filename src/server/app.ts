/* eslint-disable unicorn/prefer-module */
import { blockMiddleware } from './blockMiddleware';
import { middlewares } from './logger';
import Axios from 'axios';
import createAdmin from './admin';
import http from 'node:http';
import Koa from 'koa';
import KoaBodyparser from 'koa-bodyparser';
import koaStatic from 'koa-static';
import path from 'node:path';
import storageMiddleware from './middleware/storageMiddleware';
import type { Context, Middleware } from 'koa';

function hotHelper(getMiddleware: () => Middleware) {
  if (process.env.NODE_ENV === 'production') {
    return getMiddleware();
  }

  return (ctx: Context, next: () => Promise<any>) => getMiddleware()(ctx, next);
}

export function createApp(): Koa {
  const app = new Koa();

  app.use(blockMiddleware);

  let apiRoutes = require('./API').default;
  let serverRender = require('./render').default;
  let seoController = require('./seo').default;
  let errorHandler = require('./errorHandler').default;
  let normalizePathMiddleware = require('./middleware/normalizePath').default;

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
          apiRoutes = require('./API').default;
          seoController = require('./seo').default;
          ctx.loadableStats = JSON.parse(
            // eslint-disable-next-line no-sync
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

    app.use(hotHelper(() => apiRoutes.routes()));

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

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  server.addListener('request', app.callback());
  server.listen(port);
  // istanbul ignore next
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.log('running in DEV mode!');
  }
  createAdmin();

  return server;
};
