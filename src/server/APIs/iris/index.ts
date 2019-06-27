import { configSanitize } from 'client/util';
import { getAbfahrten } from 'server/Abfahrten';
import { noncdAxios, openDataAxios } from 'server/Abfahrten/helper';
import KoaRouter from 'koa-router';
import wingInfo from 'server/Abfahrten/wings';

const router = new KoaRouter();
const getCurrent = () =>
  new KoaRouter()
    .get('/abfahrten/:evaId', async ctx => {
      const { evaId }: { evaId: string } = ctx.params;
      const { type } = ctx.query;

      if (evaId.length < 6) {
        ctx.status = 400;
        ctx.body = {
          message: 'Please provide a evaID',
        };
      } else {
        const { lookahead, lookbehind } = ctx.query;

        ctx.body = await getAbfahrten(
          evaId,
          true,
          {
            lookahead: Number.parseInt(configSanitize.lookahead(lookahead), 10),
            lookbehind: Number.parseInt(
              configSanitize.lookbehind(lookbehind),
              10
            ),
          },
          type === 'open' ? openDataAxios : noncdAxios
        );
      }
    })
    .get('/wings/:rawId1/:rawId2', async ctx => {
      const { rawId1, rawId2 }: { rawId1: string; rawId2: string } = ctx.params;

      ctx.body = await wingInfo(rawId1, rawId2);
    });

router
  .prefix('/iris')
  .use('/current', getCurrent().routes())
  .use('/v1', getCurrent().routes());

export default router;
export const versions = ['current', 'v1'];
