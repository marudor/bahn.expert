// @flow
import { getAbfahrten } from './Abfahrten';
import { getLageplan } from './Bahnhof/Lageplan';
import { getStation } from './Abfahrten/station';
import { wagenReihung, wagenReihungStation } from './Reihung';
import axios from 'axios';
import createAuslastung from './Auslastung';
import KoaRouter from 'koa-router';
import stationSearch from './Search';

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

    ctx.body = await stationSearch(searchTerm, type);
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
