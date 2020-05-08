import Koa from 'koa';
import KoaStatic from 'koa-static';
import path from 'path';

export default (docsPort?: number) => {
  const app = new Koa();

  app.use(KoaStatic(path.resolve('docs')));

  return app.listen(docsPort);
};
