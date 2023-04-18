import Koa from 'koa';
import PromClient, { Counter, Histogram } from 'prom-client';
import type { AxiosResponse } from 'axios';
import type { Server } from 'node:http';

PromClient.register.clear();
PromClient.collectDefaultMetrics();

export const ApiRequestMetric = new Histogram({
  name: 'api_requests',
  help: 'api requests',
  labelNames: ['route', 'status'],
});

export const UpstreamApiRequestMetric = new Counter({
  name: 'upstream_api_requests',
  help: 'upstream api requests => bahn',
  labelNames: ['api', 'status'],
});

export function upstreamApiCountInterceptor(
  apiName: string,
  res: AxiosResponse,
): AxiosResponse {
  UpstreamApiRequestMetric.inc({ api: apiName, status: res.status });
  return res;
}

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
