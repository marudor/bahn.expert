import type { AxiosResponseTransformer } from 'axios';

const isoDateRegex =
	/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}\.\d*)(?:Z|([+-])([\d:|]*))?$/;

export const axiosDateTransformer: AxiosResponseTransformer = (data) => {
	if (typeof data === 'string') {
		try {
			return JSON.parse(data, (_key, value) => {
				if (typeof value === 'string' && isoDateRegex.test(value)) {
					return new Date(value);
				}
				return value;
			});
		} catch {
			// Ignoring
		}
	}
	return data;
};
