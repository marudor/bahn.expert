import { configSanitize } from 'client/util';
import { getAbfahrten } from 'server/Abfahrten';
import { noncdAxios, openDataAxios } from 'server/Abfahrten/helper';
import { ParameterizedContext } from 'koa';
import KoaRouter from 'koa-router';
import LegacyV1 from './LegacyV1';
import wingInfo from 'server/Abfahrten/wings';

export const getCurrentWingsMiddleware = () => async (
  ctx: ParameterizedContext<any, any>
) => {
  const { rawId1, rawId2 }: { rawId1: string; rawId2: string } = ctx.params;

  ctx.body = await wingInfo(rawId1, rawId2);
};

export const getCurrentAbfahrtenMiddleware = () => async (
  ctx: ParameterizedContext<any, any>
) => {
  const { evaId }: { evaId: string } = ctx.params;
  const { type, lookahead, lookbehind } = ctx.query;

  if (evaId.length < 6) {
    ctx.status = 400;
    ctx.body = {
      message: 'Please provide a evaID',
    };
  } else {
    ctx.body = await getAbfahrten(
      evaId,
      true,
      {
        lookahead: Number.parseInt(configSanitize.lookahead(lookahead), 10),
        lookbehind: Number.parseInt(configSanitize.lookbehind(lookbehind), 10),
      },
      type === 'open' ? openDataAxios : noncdAxios
    );
  }
};

const router = new KoaRouter();
const getCurrent = () =>
  new KoaRouter()
    .get('/abfahrten/:evaId', getCurrentAbfahrtenMiddleware())
    .get('/wings/:rawId1/:rawId2', getCurrentWingsMiddleware());

router
  .prefix('/iris')
  .use('/current', getCurrent().routes())
  .use('/v1', LegacyV1().routes())
  .use('/v2', getCurrent().routes());

export default router;
export const versions = ['v1', 'v2'];
