import auslastungHafas from 'server/Auslastung/Hafas';
import geoStation from 'server/HAFAS/LocGeoPos';
import journeyDetails from 'server/HAFAS/JourneyDetails';
import KoaRouter from 'koa-router';
import LocMatch from 'server/HAFAS/LocMatch';
import makeRequest from 'server/HAFAS/Request';
import routing from 'server/HAFAS/TripSearch';
import stationBoard from 'server/HAFAS/StationBoard';
import trainSearch from 'server/HAFAS/TrainSearch';

const router = new KoaRouter();
const getCurrent = () =>
  new KoaRouter()
    .get('/journeyDetails/:jid', async ctx => {
      const { jid }: { jid: string } = ctx.params;

      ctx.body = await journeyDetails(jid);
    })
    .get('/details/:trainName/:date', async ctx => {
      const { date, trainName } = ctx.params;

      const trains = await trainSearch(trainName, Number.parseInt(date, 10));

      if (trains.length) {
        ctx.body = await journeyDetails(trains[0].jid);
      } else {
        ctx.status = 404;
      }
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
    .get('/trainSearch/:trainName/:date', async ctx => {
      const { date, trainName } = ctx.params;

      ctx.body = await trainSearch(trainName, Number.parseInt(date, 10));
    })
    .get('/geoStation', async ctx => {
      const { x, y, lat, lng, maxDist = 1000 } = ctx.query;

      const realY = lat ? Number.parseFloat(lat) * 1000000 : y;
      const realX = lng ? Number.parseFloat(lng) * 1000000 : x;

      ctx.body = await geoStation(realX, realY, maxDist);
    })
    .get('/station/:searchTerm', async ctx => {
      const { searchTerm } = ctx.params;

      ctx.body = await LocMatch(searchTerm);
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
