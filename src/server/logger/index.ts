import './axiosLogging';
import cookie from 'cookie';
import pino from 'pino';
import serializers from 'pino-std-serializers';

const streams: Array<(msg: string) => void> = [];

if (process.env.PRETTY_LOG) {
	import('pino-pretty').then((pinoPretty) => {
		const prettyLog = pinoPretty.prettyFactory({
			colorize: true,
			translateTime: true,
		});

		streams.push((msg) => process.stdout.write(prettyLog(msg)));
	});
} else {
	streams.push((msg) => console.log(msg));
}

const createWriteOptions = () => {
	if (process.env.NODE_ENV === 'test') {
		return {
			write() {
				// No logging in tests
			},
		};
	}

	return {
		write: (msg: string) => {
			for (const s of streams) s(msg);
		},
	};
};

export const logger = pino(
	{
		redact: {
			paths: ['req.remoteAddress', 'req.remotePort', 'res.headers'],
			remove: true,
		},
		name: 'BahnExperte',
		level: process.env.NODE_ENV === 'production' ? 'info' : 'trace',
		serializers: {
			req: serializers.wrapRequestSerializer((req) => {
				try {
					const cookies = cookie.parse(req.headers.cookie);

					req.headers = {
						// @ts-expect-error typing wrong
						cookie: cookies,
						'user-agent': req.headers['user-agent'],
						referer: req.headers.referer,
					};
				} catch {
					// if we can't parse cookies keep them
				}

				return req;
			}),
			res: serializers.res,
			err: serializers.wrapErrorSerializer((err) => {
				try {
					delete err.config?.httpsAgent;
				} catch {
					// we ignore errors
				}
				return err;
			}),
		},
	},
	createWriteOptions(),
);
