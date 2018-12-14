// @flow
import { dbfAbfahrten, ownAbfahrten } from './Abfahrten';
import { wagenReihung, wagenReihungStation } from './Reihung';
import axios from 'axios';
import createAuslastung from './Auslastung';
import KoaRouter from 'koa-router';
import stationSearch from './Search';
import type Koa from 'koa';

const useTestData = !!process.env.TESTDATA;

if (useTestData) {
  // eslint-disable-next-line
  console.log('using TEST data!');
}

export default function setRoutes(koa: Koa, prefix: string = '/api') {
  const router = new KoaRouter();

  // Favendo offline?
  async function stationInfo(station: number) {
    const info = (await axios.get(`https://si.favendo.de/station-info/rest/api/station/${station}`)).data;

    return { id: info.id, title: info.title, evaId: info.eva_ids[0], recursive: info.eva_ids.length > 1 };
  }
  router
    .prefix(prefix)
    .get('/search/:searchTerm', async ctx => {
      if (useTestData) {
        ctx.body = require('./testData/search');

        return;
      }
      const { searchTerm } = ctx.params;
      const { type } = ctx.query;

      ctx.body = await stationSearch(searchTerm, type);
    })
    // https://si.favendo.de/station-info/rest/api/station/724
    .get('/station/:station', async ctx => {
      const { station } = ctx.params;

      ctx.body = await stationInfo(station);
    })
    .get('/dbfAbfahrten/:station', async ctx => {
      if (useTestData) {
        ctx.body = require('./testData/abfahrten');

        return;
      }
      const { station } = ctx.params;
      const evaId = station;

      if (evaId.length < 6) {
        ctx.status = 400;
        ctx.body = {
          message: 'Please provide a evaID',
        };
      } else {
        ctx.body = await dbfAbfahrten(evaId);
      }
    })
    .get('/ownAbfahrten/:station', async ctx => {
      if (useTestData) {
        ctx.body = require('./testData/abfahrten');

        return;
      }
      const { station } = ctx.params;
      const evaId = station;

      if (evaId.length < 6) {
        ctx.status = 400;
        ctx.body = {
          message: 'Please provide a evaID',
        };
      } else {
        ctx.body = await ownAbfahrten(evaId);
      }
    })
    .get('/wagenstation/:train/:station', async ctx => {
      const { train, station } = ctx.params;

      ctx.body = await wagenReihungStation([train], station);
    })
    .get('/wagen/:trainNumber/:date', async ctx => {
      if (useTestData) {
        ctx.body = require('./testData/reihung');

        return;
      }
      const { date, trainNumber } = ctx.params;

      ctx.body = await wagenReihung(trainNumber, date);
    });

  const AuslastungsUser = process.env.AUSLASTUNGS_USER;
  const AuslastungsPW = process.env.AUSLASTUNGS_PW;

  if (AuslastungsUser && AuslastungsPW) {
    const auslastung = createAuslastung(AuslastungsUser, AuslastungsPW);

    // YYYYMMDD
    router.get('/auslastung/:trainNumber/:date', async ctx => {
      if (useTestData) {
        ctx.body = require('./testData/auslastung');

        return;
      }
      const { date, trainNumber } = ctx.params;

      ctx.body = await auslastung(trainNumber, date);
    });
  }

  koa.use(router.routes());
}
