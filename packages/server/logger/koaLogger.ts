import { nanoid } from 'nanoid';
import onFinished from 'on-finished';
import util from 'util';
import type { Context, Next } from 'koa';
import type { Logger } from 'pino';

declare module 'koa' {
  interface BaseContext {
    log: Logger;
  }
  interface Request {
    reqId: string;
  }
}

const headerName = 'X-Request-Id';
const ctxProp = 'reqId';
const logField = 'req_id';

const levelFromStatus = (status: number) => {
  if (status >= 500) {
    return 'error';
  } else if (status >= 400) {
    return 'warn';
  }

  return 'info';
};

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

export default (logger: Logger) =>
  (ctx: Context, next: Next): Promise<void> => {
    ctx.log = logger;

    const reqId = ctx.request.get(headerName) || nanoid();

    ctx[ctxProp] = reqId;
    ctx.request[ctxProp] = reqId;

    ctx.log = ctx.log.child({
      [logField]: reqId,
    });

    if (process.env.NODE_ENV === 'production') {
      ctx.log.info(
        {
          req: ctx.req,
        },
        formatRequestMessage(ctx),
      );
    }

    const startTime = Date.now();
    let err: any;

    const onResponseFinished = () => {
      const responseData = {
        req: ctx.req,
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
      .catch((e) => {
        err = e;
      })
      .then(() => {
        if (process.env.NODE_ENV === 'production') {
          onFinished(ctx.response.res, onResponseFinished);
        }

        if (err) throw err;
      });
  };
