import './metrics';
import { register } from 'prom-client';
import Koa from 'koa';
import type { Server } from 'http';

export default (adminPort = 9000): Server => {
  const koa = new Koa();

  koa.use(async (ctx) => {
    try {
      switch (ctx.request.url) {
        case '/ping':
          ctx.body = 'pong';
          break;
        case '/metrics':
          ctx.body = await register.metrics();
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
