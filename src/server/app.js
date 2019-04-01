// @flow
import './features';
import { middlewares } from './logger';
import axios from 'axios';
import createAdmin from './admin';
import errorHandler from './errorHandler';
import http from 'http';
import Koa, { type Middleware } from 'koa';
import KoaBodyparser from 'koa-bodyparser';
import koaStatic from 'koa-static';
import path from 'path';

// eslint-disable-next-line no-underscore-dangle
global.__SERVER__ = true;

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

function hotHelper(getMiddleware: () => Middleware) {
  if (process.env.NODE_ENV === 'production') {
    return getMiddleware();
  }

  return (ctx, next) => getMiddleware()(ctx, next);
}

export async function createApp(wsServer: ?https$Server) {
  const app = new Koa();

  app.use(errorHandler);
  middlewares.forEach(m => app.use(m));
  app.use(KoaBodyparser());

  let apiRoutes = require('./Controller').default;
  let serverRender = require('./render').default;
  let seoController = require('./seo').default;

  if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'production') {
    await require('./middleware/webpackDev')(app, wsServer);
    app.use((ctx, next) => {
      serverRender = require('./render').default;
      apiRoutes = require('./Controller').default;
      seoController = require('./seo').default;
      ctx.stats = transformStats(ctx.state.webpackStats.toJson().assetsByChunkName);

      return next();
    });
  }

  app.use(hotHelper(() => apiRoutes.routes()));

  app.use(
    koaStatic(path.resolve(process.env.NODE_ENV === 'production' ? 'dist/client' : 'public'), {
      maxAge: 31536000000, // 1 year
    })
  );

  app.use(hotHelper(() => seoController));

  if (process.env.NODE_ENV === 'production') {
    const stats = require(path.resolve('dist/client/static/stats.json'));

    app.use((ctx, next) => {
      ctx.stats = transformStats(stats.assetsByChunkName);

      return next();
    });
  }

  app.use(hotHelper(() => serverRender));

  return (app: any);
}

export default async () => {
  const port = process.env.WEB_PORT || 9042;

  let server;
  let wsServer;

  if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test' && !process.env.NO_SSL) {
    const https = require('https');
    const fs = require('fs');
    // eslint-disable-next-line no-sync
    const key = fs.readFileSync('./secrets/ssl/privkey.pem');
    // eslint-disable-next-line no-sync
    const cert = fs.readFileSync('./secrets/ssl/server.pem');

    server = https.createServer({
      key,
      cert,
    });
    wsServer = https.createServer({
      key,
      cert,
    });
    axios.defaults.baseURL = `https://local.marudor.de:${port}`;
  } else {
    axios.defaults.baseURL = `http://localhost:${port}`;
    server = http.createServer();
  }
  const app = await createApp(wsServer);

  server.addListener('request', app.callback());
  server.listen(port);
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.log('running in DEV mode!');
  }
  createAdmin();
};
