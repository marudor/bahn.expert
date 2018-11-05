// @ƒlow
export default async (ctx, next) => {
  try {
    // eslint-disable-next-line callback-return
    await next();
  } catch (e) {
    if (e.response?.data) {
      ctx.body = e.response.data;
      ctx.status = e.response.status || 500;
    } else {
      ctx.body = e;
      ctx.status = 500;
    }
  }
};
