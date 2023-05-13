import type { Context, Middleware, Next } from 'koa';

export default function normalizePathMiddleware(): Middleware {
  const doubleSlashRegex = /\/\//g;

  return (ctx: Context, next: Next) => {
    if (doubleSlashRegex.test(ctx.url)) {
      const normalized = ctx.url.replaceAll(doubleSlashRegex, '/');

      ctx.redirect(normalized);

      return;
    }

    return next();
  };
}
