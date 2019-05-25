import auslastungHafas from 'server/Auslastung/Hafas';
import JourneyDetails from 'server/HAFAS/JourneyDetails';
import KoaRouter from 'koa-router';
import makeRequest from 'server/HAFAS/Request';
import routing from 'server/HAFAS/TripSearch';
import stationBoard from 'server/HAFAS/StationBoard';

const router = new KoaRouter();
const getCurrent = () =>
  new KoaRouter()
    .get('/details/:jid', async ctx => {
      const { jid }: { jid: string } = ctx.params;

      ctx.body = await JourneyDetails(jid);
    })
    .get('/auslastung/:start/:dest/:trainNumber/:time', async ctx => {
      const { start, dest, time, trainNumber } = ctx.params;

      ctx.body = await auslastungHafas(
        start,
        dest,
        trainNumber,
        Number.parseInt(time, 10)
      );
    })
    .get('/ArrStationBoard', async ctx => {
      const { date, station } = ctx.query;

      ctx.body = await stationBoard({
        type: 'ARR',
        station,
        date: Number.parseInt(date, 10) || undefined,
      });
    })
    .get('/DepStationBoard', async ctx => {
      const { date, station } = ctx.query;

      ctx.body = await stationBoard({
        type: 'DEP',
        station,
        date: Number.parseInt(date, 10) || undefined,
      });
    })
    .post('/rawHafas', async ctx => {
      ctx.body = await makeRequest(ctx.request.body);
    })
    .post('/route', async ctx => {
      ctx.body = await routing({
        ...ctx.request.body,
        time: Number.parseInt(ctx.request.body.time, 10),
      });
    });

router
  .prefix('/hafas')
  .use('/current', getCurrent().routes())
  .use('/v1', getCurrent().routes());

export default router;
