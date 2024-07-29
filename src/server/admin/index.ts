import type { Server } from 'node:http';
import type {
	AxiosInstance,
	AxiosResponse,
	InternalAxiosRequestConfig,
} from 'axios';
import Koa from 'koa';
import PromClient, { Counter, Histogram } from 'prom-client';

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
	labelNames: ['api'],
});

const UpstreamApiResponseMetric = new Counter({
	name: 'upstream_api_response',
	help: 'upstream api response => bahn',
	labelNames: ['api', 'code'],
});

function upstreamRequestApiCountInterceptor(
	apiName: string,
	req: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig {
	UpstreamApiRequestMetric.inc({ api: apiName });
	return req;
}

function upstreamResponseApiCountInterceptor(
	apiName: string,
	res: AxiosResponse,
): AxiosResponse {
	UpstreamApiResponseMetric.inc({ api: apiName, code: res.status });
	return res;
}

export function axiosUpstreamInterceptor(
	axios: AxiosInstance,
	apiName: string,
): void {
	axios.interceptors.request.use(
		upstreamRequestApiCountInterceptor.bind(undefined, apiName),
	);
	axios.interceptors.response.use(
		upstreamResponseApiCountInterceptor.bind(undefined, apiName),
	);
}

export default (adminPort = 9000): Server => {
	const koa = new Koa();

	koa.use(async (ctx) => {
		try {
			switch (ctx.request.url) {
				case '/ping': {
					ctx.body = 'pong';
					break;
				}
				case '/metrics': {
					ctx.body = await PromClient.register.metrics();
					break;
				}
				default: {
					break;
				}
			}
		} catch {
			ctx.status = 500;
		}
	});

	return koa.listen(adminPort);
};
