import type { IncomingMessage } from 'node:http';
import util from 'node:util';
import type { RouterContext } from '@koa/router';
import type { Context, Next } from 'koa';
import type P from 'pino';

declare module 'koa' {
	interface BaseContext {
		log: P.Logger;
	}
}

const levelFromStatus = (status: number) => {
	if (status >= 500) {
		return 'error';
	}
	if (status >= 400) {
		return 'warn';
	}

	return 'info';
};

const trimRequest = (req: IncomingMessage) => ({
	...req,
	headers: {
		...req.headers,
		'x-real-ip': undefined,
		'x-forwarded-for': undefined,
	},
});

const formatRequestMessage = (ctx: Context) =>
	util.format('<-- %s %s', ctx.request.method, ctx.request.originalUrl);

const formatResponseMessage = (ctx: Context, data: any) =>
	util.format(
		'--> %s %s %d %sms',
		ctx.request.method,
		ctx.request.originalUrl,
		ctx.status,
		data.duration,
	);

export default (logger: P.Logger) =>
	(ctx: Context & RouterContext, next: Next): Promise<void> => {
		ctx.log = logger;

		if (process.env.NODE_ENV === 'production') {
			ctx.log.info(
				{
					req: trimRequest(ctx.req),
				},
				formatRequestMessage(ctx),
			);
		}

		const startTime = Date.now();
		let err: any;

		const onResponseFinished = () => {
			const responseData = {
				req: trimRequest(ctx.req),
				matchedRouted: ctx._matchedRoute?.toString(),
				res: ctx.res,
				err: undefined,
				duration: Date.now() - startTime,
			};

			if (err) {
				responseData.err = err;
			}

			const level = levelFromStatus(ctx.status);

			ctx.log[level](responseData, formatResponseMessage(ctx, responseData));

			// @ts-expect-error mocked
			ctx.log = null;
		};

		return next()
			.catch((error) => {
				err = error;
			})
			.then(() => {
				if (process.env.NODE_ENV === 'production') {
					ctx.response.res.once('finish', onResponseFinished);
				}

				if (err) throw err;
			});
	};
