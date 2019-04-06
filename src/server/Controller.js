// @flow
import { getAbfahrten } from './Abfahrten';
import { getLageplan } from './Bahnhof/Lageplan';
import { getStation } from './Abfahrten/station';
import { isEnabled } from 'unleash-client';
import { wagenReihung, wagenReihungMonitoring, wagenReihungStation } from './Reihung';
import axios from 'axios';
import createAuslastung from './Auslastung';
import KoaRouter from 'koa-router';
import routing from './Routing';
import stationSearch from './Search';
import wingInfo from './Abfahrten/wings';

const router = new KoaRouter();

// Favendo offline?
async function stationInfo(station: number) {
  const info = (await axios.get(`https://si.favendo.de/station-info/rest/api/station/${station}`)).data;

  return { id: info.id, title: info.title, evaId: info.eva_ids[0], recursive: info.eva_ids.length > 1 };
}

router
  .prefix('/api')
  .get('/lageplan/:stationName', async ctx => {
    const { stationName } = ctx.params;

    ctx.body = {
      lageplan: await getLageplan(stationName),
    };
  })
  .get('/search/:searchTerm', async ctx => {
    const { searchTerm } = ctx.params;
    const { type } = ctx.query;

    // $FlowFixMe - assume type is StationSearchType
    ctx.body = await stationSearch(searchTerm, type);
  })
  .get('/feature/:name', ctx => {
    ctx.body = isEnabled(ctx.params.name);
  })
  .post('/route', async ctx => {
    ctx.body = await routing({
      ...ctx.request.body,
      // $FlowFixMe - we assume user enters correct params
      time: Number.parseInt(ctx.request.body.time, 10),
    });
  })
  // https://si.favendo.de/station-info/rest/api/station/724
  .get('/station/:station', async ctx => {
    const { station } = ctx.params;

    ctx.body = await stationInfo(station);
  })
  .get('/irisStation/:evaId', async ctx => {
    const { evaId } = ctx.params;

    ctx.body = await getStation(evaId, 1);
  })
  .get('/ownAbfahrten/:evaId', async ctx => {
    const { evaId } = ctx.params;

    if (evaId.length < 6) {
      ctx.status = 400;
      ctx.body = {
        message: 'Please provide a evaID',
      };
    } else {
      const { lookahead } = ctx.query;

      ctx.body = await getAbfahrten(evaId, true, {
        lookahead: Number.parseInt(lookahead, 10),
      });
    }
  })
  .get('/wagenstation/:train/:station', async ctx => {
    const { train, station } = ctx.params;

    ctx.body = await wagenReihungStation([train], station);
  })
  .get('/wagen/:trainNumber/:date', async ctx => {
    const { date, trainNumber } = ctx.params;

    ctx.body = await wagenReihung(trainNumber, Number.parseInt(date, 10));
  })
  .get('/monitoring/wagen', async ctx => {
    ctx.body = await wagenReihungMonitoring();
  })
  .get('/wings/:rawId1/:rawId2', async ctx => {
    const { rawId1, rawId2 } = ctx.params;

    ctx.body = await wingInfo(rawId1, rawId2);
  });

const AuslastungsUser = process.env.AUSLASTUNGS_USER;
const AuslastungsPW = process.env.AUSLASTUNGS_PW;

if (AuslastungsUser && AuslastungsPW) {
  const auslastung = createAuslastung(AuslastungsUser, AuslastungsPW);

  // YYYYMMDD
  router.get('/auslastung/:trainNumber/:date', async ctx => {
    const { date, trainNumber } = ctx.params;

    ctx.body = await auslastung(trainNumber, date);
  });
}

export default router;
