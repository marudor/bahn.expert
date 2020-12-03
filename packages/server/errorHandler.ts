import * as Sentry from '@sentry/node';
import type { Context, Next } from 'koa';

const handledHafasError = ['H9380', 'NO_MATCH'];

export default async (ctx: Context, next: Next): Promise<void> => {
  try {
    // eslint-disable-next-line callback-return
    await next();
  } catch (e) {
    ctx.set('Content-Type', 'application/json');
    if (e.response && !e.customError) {
      ctx.body = {
        statusText: e.response.statusText,
        data: JSON.stringify(e.response.data),
      };
      ctx.status = e.response.status || 500;
    } else {
      // @ts-expect-error works
      if (e instanceof Error && !handledHafasError.includes(e.errorCode)) {
        Sentry.withScope((scope) => {
          if (e.data) {
            scope.setExtra('data', e.data);
          }
          scope.addEventProcessor((event) =>
            // @ts-expect-error sentry can handle koa request
            Sentry.Handlers.parseRequest(event, ctx.request),
          );
          Sentry.captureException(e);
        });
        // @ts-expect-error works
        if (e.status === 400) {
          try {
            const parsed = JSON.parse(e.message);

            ctx.body = parsed;
            // @ts-expect-error works
            ctx.status = e.status || 500;

            return;
          } catch (e) {
            // ignored
          }
        }
      }
      if (e.message) {
        ctx.res.setHeader('Content-Type', 'text');
        ctx.body = e.message;
      } else {
        ctx.body = e;
      }
      ctx.status = e.status || 500;
    }
  }
};
