import Client from 'prom-client';
import Koa from 'koa';
import type { Server } from 'http';

export default (adminPort = 9000): Server => {
  Client.collectDefaultMetrics();
  const koa = new Koa();

  koa.use((ctx) => {
    switch (ctx.request.url) {
      case '/metrics':
        // eslint-disable-next-line no-console
        console.log('SERVED METRICS');
        ctx.body = Client.register.metrics();
        break;
      case '/ping':
        ctx.body = 'pong';
        break;
      default:
        break;
    }
  });

  return koa.listen(adminPort);
};
