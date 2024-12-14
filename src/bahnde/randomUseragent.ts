import type { InternalAxiosRequestConfig } from 'axios';

const fromRange = (min: number, max: number): number => {
	const ceiledMin = Math.ceil(min);

	return (
		Math.floor(Math.random() * (Math.floor(max) - ceiledMin + 1)) + ceiledMin
	);
};

const chrome = (): string => {
	const variants = {
		major: { min: 126, max: 128 },
		patch: { min: 6478, max: 6668 },
		build: { min: 29, max: 234 },
	};

	const major = fromRange(variants.major.min, variants.major.max);

	return `${major}.0.${fromRange(variants.patch.min, variants.patch.max)}.${fromRange(variants.build.min, variants.build.max)}`;
};

const firefox = (): string => {
	const variants = {
		major: { min: 128, max: 130 },
	};

	const major = fromRange(variants.major.min, variants.major.max);

	return `${major}.0${Math.random() < 0.3 ? 'esr' : ''}`;
};

const randomUseragent = () => {
	if (Math.random() <= 0.2) {
		return firefox();
	}
	return chrome();
};

export function addRandomBrowserUseragent(req: InternalAxiosRequestConfig) {
	req.headers = req.headers || {};
	req.headers['User-Agent'] = randomUseragent();
	return req;
}
