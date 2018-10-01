// @flow
import { middlewares } from './logger';
import http from 'http';
import Koa from 'koa';
import KoaBodyparser from 'koa-bodyparser';
import KoaCompress from 'koa-compress';
import Sentry from '@sentry/node';
import setupRoutes from './Controller';

const sentryDSN = process.env.SENTRY_DSN;

const koa = new Koa();
const server = http.createServer(koa.callback());

middlewares.forEach(m => koa.use(m));
koa.use(KoaCompress()).use(KoaBodyparser());
setupRoutes(koa);

if (sentryDSN) {
  // eslint-disable-next-line no-console
  console.log('logging to Sentry');
  Sentry.init({ dsn: sentryDSN });

  koa.on('error', err => {
    Sentry.captureException(err);
  });
}

server.listen(process.env.WEB_PORT || 9042);

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line no-console
  console.log('running in DEV mode!');
}

if (process.env.NODE_ENV === 'test') {
  // eslint-disable-next-line
  console.log('using TEST data!');
}
