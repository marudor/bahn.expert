// @flow
import { middlewares } from './logger';
import createAdmin from './admin';
import errorHandler from './errorHandler';
import http from 'http';
import Koa from 'koa';
import KoaBodyparser from 'koa-bodyparser';
import KoaCompress from 'koa-compress';
import koaStatic from 'koa-static';
import mount from 'koa-mount';
import path from 'path';
import setupRoutes from './Controller';

function transformStats(stats) {
  const newStats = {};

  Object.keys(stats).forEach(key => {
    if (!Array.isArray(stats[key])) {
      stats[key] = [stats[key]];
    }
    newStats[key] = {
      css: [],
      js: [],
    };
    stats[key].forEach(val => {
      if (val.endsWith('js')) {
        newStats[key].js.push(val);
      } else if (val.endsWith('css')) {
        newStats[key].css.push(val);
      }
    });
  });

  return newStats;
}

export async function createApp() {
  const app = new Koa();

  app.use(errorHandler);
  middlewares.forEach(m => app.use(m));
  app.use(KoaCompress()).use(KoaBodyparser());
  setupRoutes(app);
  app.use(
    koaStatic(path.resolve('dist/client'), {
      maxAge: 2592000000, // 30 days
    })
  );

  if (process.env.NODE_ENV !== 'test') {
    let serverRender = require('./render').default;

    if (process.env.NODE_ENV !== 'production') {
      await require('./middleware/webpackDev')(app);
      app.use((ctx, next) => {
        serverRender = require('./render').default;
        ctx.stats = transformStats(ctx.state.webpackStats.toJson().assetsByChunkName);

        return next();
      });
      app.use(ctx => serverRender(ctx));
    } else {
      // $FlowFixMe
      const stats = require(path.resolve('dist/client/static/stats.json'));

      app.use((ctx, next) => {
        ctx.stats = transformStats(stats.assetsByChunkName);

        return next();
      });
      app.use(serverRender);
    }
  }

  return app;
}

export default async () => {
  const app = await createApp();
  const server = http.createServer(app.callback());

  server.listen(process.env.WEB_PORT || 9042);
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.log('running in DEV mode!');
  }
  createAdmin();
};
