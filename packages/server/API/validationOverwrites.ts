import { AllowedHafasProfile } from 'types/HAFAS';
import { apiUsage } from 'server/plausible';
import KoaRouter from '@koa/router';

const router = new KoaRouter();

router.all('/api/hafas/(.*)', (ctx, next) => {
  const hafasProfile: any = ctx.query.profile;

  if (
    hafasProfile &&
    !Object.values(AllowedHafasProfile).includes(hafasProfile)
  ) {
    delete ctx.query.profile;
  }
  ctx.response.set('hafasProfile', ctx.query.profile || AllowedHafasProfile.DB);

  return next();
});

router.all('/api/(.*)', async (ctx, next) => {
  await next();
  void apiUsage(ctx);
});

export default router;
