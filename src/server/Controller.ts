import bahnhofApi from './APIs/bahnhof';
import hafasApi from './APIs/hafas';
import irisApi from './APIs/iris';
import KoaRouter from 'koa-router';
import reihungApi from './APIs/reihung';
import stationApi from './APIs/station';

const router = new KoaRouter();

router
  .prefix('/api')
  .use(bahnhofApi.routes())
  .use(stationApi.routes())
  .use(irisApi.routes())
  .use(reihungApi.routes())
  .use(hafasApi.routes());

export default router;
