import { AllowedHafasProfile } from 'types/HAFAS';
import { validationOverwrite as stationValidationOverwrite } from './controller/Station/v1';
import KoaRouter from '@koa/router';

const allOverwrites = [...stationValidationOverwrite];

const router = new KoaRouter();

router.prefix('/api').all('*', (ctx, next) => {
  if (ctx.url.startsWith('/api/hafas')) {
    const hafasProfile = ctx.query.profile;

    if (
      hafasProfile &&
      !Object.values(AllowedHafasProfile).includes(hafasProfile)
    ) {
      delete ctx.query.profile;
    }
    ctx.response.set(
      'hafasProfile',
      ctx.query.profile || AllowedHafasProfile.DB,
    );
  }

  return next();
});

allOverwrites.forEach(({ url, type, middleware }) => {
  // @ts-expect-error works
  router[type](url, middleware);
});

export default router;
