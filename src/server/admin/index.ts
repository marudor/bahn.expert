import Koa from 'koa';
import PromClient, { Histogram } from 'prom-client';
import type { Server } from 'node:http';

PromClient.register.clear();
PromClient.collectDefaultMetrics();

export const ApiRequestMetric = new Histogram({
  name: 'api_requests',
  help: 'api requests',
  labelNames: ['route', 'status'],
});

export default (adminPort = 9000): Server => {
  const koa = new Koa();

  koa.use(async (ctx) => {
    try {
      switch (ctx.request.url) {
        case '/ping':
          ctx.body = 'pong';
          break;
        case '/metrics':
          ctx.body = await PromClient.register.metrics();
          break;
        default:
          break;
      }
    } catch {
      ctx.status = 500;
    }
  });

  return koa.listen(adminPort);
};
