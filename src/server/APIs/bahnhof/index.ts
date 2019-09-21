import { getLageplan } from 'server/Bahnhof/Lageplan';
import { LageplanResponse } from 'types/api/bahnhof';
import KoaRouter from 'koa-router';

const router = new KoaRouter();
const getCurrent = () =>
  new KoaRouter().get('/lageplan/:stationName', async ctx => {
    const { stationName }: { stationName: string } = ctx.params;
    const body: LageplanResponse = {
      lageplan: await getLageplan(stationName),
    };

    ctx.body = body;
  });

router
  .prefix('/bahnhof')
  .use('/current', getCurrent().routes())
  .use('/v1', getCurrent().routes());

export default router;
export const versions = ['v1'];
