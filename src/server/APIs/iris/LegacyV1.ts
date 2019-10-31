import {
  getCurrentAbfahrtenMiddleware,
  getCurrentWingsMiddleware,
} from 'server/APIs/iris';
import { getLageplan } from 'server/Bahnhof/Lageplan';
import { getSingleStation } from 'server/Abfahrten/station';
import KoaRouter from 'koa-router';

export default () => {
  const CurrentAbfahrtenMiddleware = getCurrentAbfahrtenMiddleware();

  return new KoaRouter()
    .get('/abfahrten/:evaId', async ctx => {
      await CurrentAbfahrtenMiddleware(ctx);
      if (ctx.status === 200) {
        const station = await getSingleStation(ctx.params.evaId);

        if (station) {
          ctx.body.lageplan = await getLageplan(station.name);
        }
      }
    })
    .get('/wings/:rawId1/:rawId2', getCurrentWingsMiddleware());
};
