import * as Sentry from '@sentry/node';
import { Context } from 'koa';
import serialize from 'serialize-javascript';

const handledHafasError = ['H9380'];

export default async (ctx: Context, next: Function) => {
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
      // @ts-ignore
      if (e instanceof Error && !handledHafasError.includes(e.errorCode)) {
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
      ctx.body = JSON.stringify(e);
      ctx.status = e.status || 500;
    }
  }
};
