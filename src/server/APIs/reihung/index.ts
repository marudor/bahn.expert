import {
  wagenReihung,
  wagenReihungMonitoring,
  wagenReihungStation,
} from 'server/Reihung';
import KoaRouter from 'koa-router';

const router = new KoaRouter();
const getCurrent = () =>
  new KoaRouter()
    .get('/wagenstation/:train/:station', async ctx => {
      const { train, station }: { train: string; station: string } = ctx.params;

      ctx.body = await wagenReihungStation([train], station);
    })
    .get('/wagen/:trainNumber/:date', async ctx => {
      const {
        date,
        trainNumber,
      }: { date: string; trainNumber: string } = ctx.params;

      ctx.body = await wagenReihung(trainNumber, Number.parseInt(date, 10));
    });

router
  .prefix('/reihung')
  .use('/current', getCurrent().routes())
  .use('/v1', getCurrent().routes())
  .get('/monitoring/wagen', async ctx => {
    ctx.body = await wagenReihungMonitoring();
    if (!ctx.body) {
      ctx.status = 404;
    }
  });

export default router;
export const versions = ['v1'];
