import type { Context, Next } from 'koa';

const handledHafasError = new Set(['H9380', 'NO_MATCH']);

export default async (ctx: Context, next: Next): Promise<void> => {
	try {
		await next();
	} catch (error: any) {
		ctx.set('Content-Type', 'application/json');
		if (error.response && !error.customError) {
			ctx.body = {
				statusText: error.response.statusText,
				data: JSON.stringify(error.response.data),
			};
			ctx.status = error.response.status || 500;
		} else {
			if (
				error instanceof Error &&
				// @ts-expect-error works
				!handledHafasError.has(error.errorCode) &&
				// @ts-expect-error works
				error.status === 400
			) {
				try {
					const parsed = JSON.parse(error.message);

					ctx.body = parsed;
					// @ts-expect-error works
					ctx.status = error.status || 500;

					return;
				} catch {
					// ignored
				}
			}
			if (error.message) {
				ctx.res.setHeader('Content-Type', 'text');
				ctx.body = error.message;
			}
			ctx.status = error.status || 500;
		}
	}
};
