import Koa from 'koa';
import KoaStatic from 'koa-static';
import path from 'path';
import type { Server } from 'http';

export default (docsPort?: number): Server => {
  const app = new Koa();

  app.use(KoaStatic(path.resolve('docs')));

  return app.listen(docsPort);
};
