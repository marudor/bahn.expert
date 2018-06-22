// @flow
import http from 'http';
import Koa from 'koa';
import KoaBodyparser from 'koa-bodyparser';
import KoaCompress from 'koa-compress';
import setupRoutes from './Controller';

const koa = new Koa();
const server = http.createServer(koa.callback());

koa.use(KoaCompress()).use(KoaBodyparser());
setupRoutes(koa);

server.listen(process.env.WEB_PORT || 9042);

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line
  console.log('running in DEV mode!');
}

if (process.env.NODE_ENV === 'test') {
  // eslint-disable-next-line
  console.log('using TEST data!');
}
