import { getLageplan } from 'server/Bahnhof/Lageplan';
import KoaRouter from 'koa-router';

const router = new KoaRouter();
const getCurrent = () =>
  new KoaRouter().get('/lageplan/:stationName', async ctx => {
    const { stationName }: { stationName: string } = ctx.params;

    ctx.body = {
      lageplan: await getLageplan(stationName),
    };
  });

router
  .prefix('/bahnhof')
  .use('/current', getCurrent().routes())
  .use('/v1', getCurrent().routes());

export default router;
export const versions = ['current', 'v1'];
