import { getStation } from 'server/Abfahrten/station';
import { StationSearchType } from 'Common/config';
import favendoSearch from 'server/Search/Favendo';
import KoaRouter from 'koa-router';
import stationSearch from 'server/Search';

const router = new KoaRouter();
const getCurrent = () =>
  new KoaRouter()
    .get('/search/:searchTerm?', async ctx => {
      const { searchTerm = '' }: { searchTerm: string } = ctx.params;
      const { type } = ctx.query;

      const typeEnum = StationSearchType[Number.parseInt(type, 10)] as any;
      const searchType = (StationSearchType[
        typeEnum
      ] as any) as StationSearchType;

      ctx.body = await stationSearch(searchTerm, searchType);
    })
    .get('/geoSearch', async ctx => {
      ctx.body = await favendoSearch('', ctx.query);
    })
    .get('/iris/:evaId', async ctx => {
      const { evaId }: { evaId: string } = ctx.params;

      ctx.body = await getStation(evaId, 1);
    });

router
  .prefix('/station')
  .use('/current', getCurrent().routes())
  .use('/v1', getCurrent().routes());

export default router;
export const versions = ['v1'];
