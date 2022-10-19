import type { Context } from 'koa';

const refererBlockList = process.env.REFERER_BLOCK_LIST?.split(',').map(
  (host) => new RegExp(`https?://${host}`),
);

export const blockMiddleware = (
  ctx: Context,
  next: () => Promise<any>,
): Promise<any> | void => {
  if (!refererBlockList) {
    return next();
  }
  const referer = ctx.request.headers.referer;
  if (referer && refererBlockList.some((r) => referer.match(r))) {
    ctx.status = 401;
    return;
  }
  return next();
};
