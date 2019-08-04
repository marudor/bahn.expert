import * as Sentry from '@sentry/node';
import { Context } from 'koa';
import serialize from 'serialize-javascript';

export default async (ctx: Context, next: Function) => {
  try {
    // eslint-disable-next-line callback-return
    await next();
  } catch (e) {
    ctx.set('Content-Type', 'application/json');
    if (e.response && !e.customError) {
      ctx.body = {
        statusText: e.response.statusText,
        data: serialize(e.response.data),
      };
      ctx.status = e.response.status || 500;
    } else {
      if (e instanceof Error) {
        Sentry.withScope(scope => {
          if (e.data) {
            scope.setExtra('data', e.data);
          }
          scope.addEventProcessor(event =>
            Sentry.Handlers.parseRequest(event, ctx.request)
          );
          Sentry.captureException(e);
        });
      }
      ctx.body = serialize(e);
      ctx.status = e.status || 500;
    }
  }
};
