import { Context } from 'koa';
import serialize from 'serialize-javascript';

export default async (ctx: Context, next: Function) => {
  try {
    // eslint-disable-next-line callback-return
    await next();
  } catch (e) {
    if (e.response) {
      ctx.body = {
        statusText: e.response.statusText,
        data: serialize(e.response.data),
      };
      ctx.status = e.response.status || 500;
    } else {
      // eslint-disable-next-line no-console
      console.error(e);
      ctx.body = serialize(e);
      ctx.status = e.status || 500;
    }
  }
};
