// @flow
import { middlewares } from './logger';
import errorHandler from './errorHandler';
import Koa from 'koa';
import KoaBodyparser from 'koa-bodyparser';
import KoaCompress from 'koa-compress';
import setupRoutes from './Controller';

export default () => {
  const app = new Koa();

  app.use(errorHandler);
  middlewares.forEach(m => app.use(m));
  app.use(KoaCompress()).use(KoaBodyparser());
  setupRoutes(app);

  return app;
};
