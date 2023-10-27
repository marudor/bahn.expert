import { ServerStorage } from '@/client/Common/Storage';
import type { Context, Next } from 'koa';
import type { CookieChangeOptions } from 'universal-cookie';

declare module 'koa' {
  interface Request {
    storage: ServerStorage;
  }
}

export default async function storageMiddleware(
  ctx: Context,
  next: Next,
): Promise<void> {
  ctx.request.storage = new ServerStorage(ctx.request.headers.cookie || '');
  const cookies = ctx.cookies;
  const changeHandler = (change: CookieChangeOptions) => {
    if (change.value === undefined) {
      cookies.set(change.name, null);
    } else {
      cookies.set(
        change.name,
        encodeURIComponent(change.value),
        change.options,
      );
    }
  };
  ctx.request.storage.addChangeListener(changeHandler);

  const r = await next();

  ctx.request.storage.removeChangeListener(changeHandler);

  // @ts-expect-error this prevents memory leaks
  delete ctx.request.storage;

  return r;
}
