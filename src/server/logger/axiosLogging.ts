import { logger } from '@/server/logger';
import Axios from 'axios';

if (!Array.isArray(Axios.defaults.transformRequest)) {
	if (Axios.defaults.transformRequest) {
		Axios.defaults.transformRequest = [Axios.defaults.transformRequest];
	} else {
		Axios.defaults.transformRequest = [];
	}
}
Axios.defaults.transformRequest.push(function (data, _headers) {
	let url = this.url;
	if (url?.startsWith('/')) {
		url = `${this.baseURL}${url}`;
	}
	const logParams: Record<string, string | undefined> = {
		method: this.method?.toUpperCase(),
		url,
	};
	logger.debug(logParams, 'Request');
	if (data) {
		return data;
	}
});

if (!Array.isArray(Axios.defaults.transformResponse)) {
	if (Axios.defaults.transformResponse) {
		Axios.defaults.transformResponse = [Axios.defaults.transformResponse];
	} else {
		Axios.defaults.transformResponse = [];
	}
}

Axios.defaults.transformResponse.push(function (data, _header, status) {
	let url = this.url;
	if (url?.startsWith('/')) {
		url = `${this.baseURL}${url}`;
	}
	const logFn = (status === 200 ? logger.debug : logger.warn).bind(logger);
	logFn(
		{
			method: this.method?.toUpperCase(),
			url,
		},
		`${status} - Response`,
	);
	return data;
});
