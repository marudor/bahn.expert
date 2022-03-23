import Koa from 'koa';
import type { Server } from 'http';

export default (adminPort = 9000): Server => {
  const koa = new Koa();

  koa.use((ctx) => {
    try {
      switch (ctx.request.url) {
        case '/ping':
          ctx.body = 'pong';
          break;
        default:
          break;
      }
    } catch (e) {
      ctx.status = 500;
    }
  });

  return koa.listen(adminPort);
};
