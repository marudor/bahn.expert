import { AllowedHafasProfile } from 'types/HAFAS';
import { apiCounter, makeLabelPromCompatible } from 'server/admin/metrics';
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

  const isInternal =
    ctx.request.headers.referer?.startsWith('https://marudor.de') ||
    ctx.request.headers.referer?.startsWith('https://beta.marudor.de');

  const labelName = makeLabelPromCompatible(ctx._matchedRoute?.toString());
  if (labelName) {
    try {
      apiCounter.inc({
        route: ctx._matchedRoute?.toString(),
        type: isInternal ? 'internal' : 'external',
      });
    } catch (e) {
      ctx.log.error(e, 'apiCounter failed');
    }
  }
});

export default router;
