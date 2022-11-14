import Koa from 'koa';
import PromClient, { Counter } from 'prom-client';
import type { Server } from 'node:http';

PromClient.register.clear();
PromClient.collectDefaultMetrics();

const counter: Record<string, Counter> = {};

export const getApiRequestCounter = (matchedRouteName: string): Counter => {
  if (!counter[matchedRouteName]) {
    const name = matchedRouteName.replaceAll('/', '_');
    counter[matchedRouteName] = new Counter({
      name,
      help: `counter for ${matchedRouteName}`,
    });
  }
  return counter[matchedRouteName];
};

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
