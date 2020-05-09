import Storage from 'client/Common/Storage';
import type { Context } from 'koa';
import type { CookieChangeOptions } from 'universal-cookie';

declare module 'koa' {
  interface Request {
    storage: Storage;
  }
}

export default function storageMiddleware() {
  return (ctx: Context, next: () => void) => {
    ctx.request.storage = new Storage(ctx.request.headers.cookie || '');
    ctx.request.storage.addChangeListener((change: CookieChangeOptions) => {
      if (change.value === undefined) {
        // @ts-ignore
        ctx.cookies.set(change.name, null);
      } else {
        ctx.cookies.set(change.name, change.value, change.options);
      }
    });

    return next();
  };
}
