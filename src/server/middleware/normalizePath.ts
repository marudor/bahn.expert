import { Context } from 'koa';

export default function normalizePathMiddleware() {
  const doubleSlashRegex = /\/\//g;

  return (ctx: Context, next: () => void) => {
    if (doubleSlashRegex.test(ctx.url)) {
      const normalized = ctx.url.replace(doubleSlashRegex, '/');

      ctx.redirect(normalized);

      return;
    }

    return next();
  };
}
