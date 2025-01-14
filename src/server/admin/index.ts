import { createServer } from 'node:http';
import {
	type AxiosInstance,
	type AxiosResponse,
	type InternalAxiosRequestConfig,
	isAxiosError,
} from 'axios';
import PromClient, { Counter, Histogram } from 'prom-client';

export let ApiRequestMetric = PromClient.register.getSingleMetric(
	'api_requests',
) as Histogram | undefined;
if (!ApiRequestMetric) {
	ApiRequestMetric = new Histogram({
		name: 'api_requests',
		help: 'api requests',
		labelNames: ['route', 'status'],
	});
	PromClient.register.registerMetric(ApiRequestMetric);
}

export let UpstreamApiRequestMetric = PromClient.register.getSingleMetric(
	'upstream_api_requests',
) as Counter | undefined;
if (!UpstreamApiRequestMetric) {
	UpstreamApiRequestMetric = new Counter({
		name: 'upstream_api_requests',
		help: 'upstream api requests => bahn',
		labelNames: ['api'],
	});
	PromClient.register.registerMetric(UpstreamApiRequestMetric);
}

let UpstreamApiResponseMetric = PromClient.register.getSingleMetric(
	'upstream_api_response',
) as Counter | undefined;
if (!UpstreamApiResponseMetric) {
	UpstreamApiResponseMetric = new Counter({
		name: 'upstream_api_response',
		help: 'upstream api response => bahn',
		labelNames: ['api', 'code'],
	});
	PromClient.register.registerMetric(UpstreamApiResponseMetric);
}

function upstreamRequestApiCountInterceptor(
	apiName: string,
	req: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig {
	UpstreamApiRequestMetric?.inc({ api: apiName });
	return req;
}

function upstreamResponseApiCountInterceptor(
	apiName: string,
	res: AxiosResponse,
): AxiosResponse {
	UpstreamApiResponseMetric?.inc({ api: apiName, code: res.status });
	return res;
}

function upstreamErrorResponseApiCountInterceptor(apiName: string, error: any) {
	if (isAxiosError(error) && error.status) {
		UpstreamApiResponseMetric?.inc({ api: apiName, code: error.status });
	}
	return error;
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
		upstreamErrorResponseApiCountInterceptor.bind(undefined, apiName),
	);
}

export default () => {
	PromClient.collectDefaultMetrics();
	if (globalThis.adminServer) {
		globalThis.adminServer.close();
	}
	globalThis.adminServer = createServer(async (req, res) => {
		try {
			switch (req.url) {
				case '/ping':
					res.write('pong');
					break;
				case '/metrics':
					res.write(await PromClient.register.metrics());
					break;
				default:
					res.statusCode = 404;
					break;
			}
		} catch {
			res.statusCode = 500;
		} finally {
			res.end();
		}
	}).listen(9000);
};
