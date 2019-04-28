import { configSanitize } from 'client/util';
import { getAbfahrten } from './Abfahrten';
import { getLageplan } from './Bahnhof/Lageplan';
import { getStation } from './Abfahrten/station';
import { isEnabled } from 'unleash-client';
import { openDataAxios } from './Abfahrten/helper';
import { StationSearchType } from 'Common/config';
import {
  wagenReihung,
  wagenReihungMonitoring,
  wagenReihungStation,
} from './Reihung';
import auslastungHafas from './Auslastung/Hafas';
import axios from 'axios';
import createAuslastung from './Auslastung/Auslastungsradar';
import JourneyDetails from './HAFAS/JourneyDetails';
import KoaRouter from 'koa-router';
import makeRequest from './HAFAS/Request';
import routing from './HAFAS/TripSearch';
import stationSearch from './Search';
import wingInfo from './Abfahrten/wings';

const router = new KoaRouter();

// Favendo offline?
async function stationInfo(station: string) {
  const info = (await axios.get(
    `https://si.favendo.de/station-info/rest/api/station/${station}`
  )).data;

  return {
    id: info.id,
    title: info.title,
    evaId: info.eva_ids[0],
    recursive: info.eva_ids.length > 1,
  };
}

router
  .prefix('/api')
  .get('/lageplan/:stationName', async ctx => {
    const { stationName }: { stationName: string } = ctx.params;

    ctx.body = {
      lageplan: await getLageplan(stationName),
    };
  })
  .get('/search/:searchTerm', async ctx => {
    const { searchTerm }: { searchTerm: string } = ctx.params;
    const { type } = ctx.query;

    ctx.body = await stationSearch(
      searchTerm,
      // @ts-ignore this lookup works
      StationSearchType[StationSearchType[Number.parseInt(type, 10)]]
    );
  })
  // https://si.favendo.de/station-info/rest/api/station/724
  .get('/station/:station', async ctx => {
    const { station }: { station: string } = ctx.params;

    ctx.body = await stationInfo(station);
  })
  .get('/irisStation/:evaId', async ctx => {
    const { evaId }: { evaId: string } = ctx.params;

    ctx.body = await getStation(evaId, 1);
  })
  .get('/ownAbfahrten/:evaId', async ctx => {
    const { evaId }: { evaId: string } = ctx.params;

    if (evaId.length < 6) {
      ctx.status = 400;
      ctx.body = {
        message: 'Please provide a evaID',
      };
    } else {
      const { lookahead, lookbehind } = ctx.query;

      ctx.body = await getAbfahrten(evaId, true, {
        lookahead: Number.parseInt(configSanitize.lookahead(lookahead), 10),
        lookbehind: Number.parseInt(configSanitize.lookbehind(lookbehind), 10),
      });
    }
  })
  .get('/ownAbfahrtenOpen/:evaId', async ctx => {
    const { evaId }: { evaId: string } = ctx.params;

    if (evaId.length < 6) {
      ctx.status = 400;
      ctx.body = {
        message: 'Please provide a evaID',
      };
    } else {
      const { lookahead, lookbehind } = ctx.query;

      ctx.body = await getAbfahrten(
        evaId,
        true,
        {
          lookahead: Number.parseInt(configSanitize.lookahead(lookahead), 10),
          lookbehind: Number.parseInt(
            configSanitize.lookbehind(lookbehind),
            10
          ),
        },
        openDataAxios
      );
    }
  })
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
  })
  .get('/monitoring/wagen', async ctx => {
    ctx.body = await wagenReihungMonitoring();
    if (!ctx.body) {
      ctx.status = 404;
    }
  })
  .get('/wings/:rawId1/:rawId2', async ctx => {
    const { rawId1, rawId2 }: { rawId1: string; rawId2: string } = ctx.params;

    ctx.body = await wingInfo(rawId1, rawId2);
  })
  .get('/details/:jid', async ctx => {
    const { jid }: { jid: string } = ctx.params;

    ctx.body = await JourneyDetails(jid);
  })
  .get('/auslastungHafas/:start/:dest/:trainNumber/:time', async ctx => {
    const { start, dest, time, trainNumber } = ctx.params;

    ctx.body = await auslastungHafas(
      start,
      dest,
      trainNumber,
      Number.parseInt(time, 10)
    );
  })
  .post('/rawHafas', async ctx => {
    ctx.body = await makeRequest(ctx.request.body);
  })
  .post('/route', async ctx => {
    if (!isEnabled('routing')) {
      ctx.status = 404;

      return;
    }
    ctx.body = await routing({
      ...ctx.request.body,
      time: Number.parseInt(ctx.request.body.time, 10),
    });
  });

const AuslastungsUser = process.env.AUSLASTUNGS_USER;
const AuslastungsPW = process.env.AUSLASTUNGS_PW;

if (AuslastungsUser && AuslastungsPW) {
  const auslastung = createAuslastung(AuslastungsUser, AuslastungsPW);

  // YYYYMMDD
  router.get('/auslastung/:trainNumber/:date', async ctx => {
    const {
      date,
      trainNumber,
    }: { date: string; trainNumber: string } = ctx.params;

    ctx.body = await auslastung(trainNumber, date);
  });
}

if (process.env.NODE_ENV !== 'production') {
  router
    .post('/route/raw', async ctx => {
      ctx.body = await routing(
        {
          ...ctx.request.body,
          time: Number.parseInt(ctx.request.body.time, 10),
        },
        true
      );
    })
    .get('/feature/:name', ctx => {
      ctx.body = isEnabled(ctx.params.name);
    });
}

export default router;
