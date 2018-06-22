// @flow
import { wagenReihung, wagenReihungStation } from './Reihung';
import axios from 'axios';
import createAuslastung from './Auslastung';
import iconv from 'iconv-lite';
import KoaRouter from 'koa-router';
import type Koa from 'koa';

const useTestData = process.env.NODE_ENV === 'test';

export default function setRoutes(koa: Koa, prefix: string = '/api') {
  const router = new KoaRouter();

  function encodeSearchTerm(term: string) {
    return term
      .replace(/ü/g, 'ue')
      .replace(/Ü/g, 'UE')
      .replace(/ä/g, 'ae')
      .replace(/Ä/g, 'AE')
      .replace(/ö/g, 'oe')
      .replace(/Ö/g, 'OE')
      .replace(/ß/g, 'ss')
      .replace(/%2F/g, '/');
  }

  async function stationInfo(station: number) {
    const info = (await axios.get(`https://si.favendo.de/station-info/rest/api/station/${station}`)).data;

    return { id: info.id, title: info.title, evaId: info.eva_ids[0], recursive: info.eva_ids.length > 1 };
  }

  // http://reiseauskunft.bahn.de/bin/ajax-getstop.exe/dn?S=Tauberbischofsheim
  async function stationSearchHAFAS(searchTerm: string) {
    const buffer = (await axios.get(
      `http://reiseauskunft.bahn.de/bin/ajax-getstop.exe/dn?S=${encodeSearchTerm(searchTerm)}*`,
      {
        responseType: 'arraybuffer',
      }
    )).data;
    const rawReply = iconv.decode(buffer, 'latin-1');
    const stringReply = rawReply.substring(8, rawReply.length - 22);
    const stations = JSON.parse(stringReply).suggestions;

    return stations.map(station => ({
      title: station.value,
      id: Number.parseInt(station.extId, 10).toString(),
    }));
  }

  async function stationSearch(searchTerm: string) {
    const stations = (await axios.get(
      `https://si.favendo.de/station-info/rest/api/search?searchTerm=${encodeSearchTerm(searchTerm)}`
    )).data;

    return stations.map(station => ({
      title: station.title,
      id: station.id,
    }));
  }

  const numberRegex = /\w+ (\d+)/;
  const longDistanceRegex = /(ICE?|TGV|ECE?|RJ).*/;

  function getTrainNumber(train: string) {
    try {
      return Number.parseInt(numberRegex.exec(train)[1], 10);
    } catch (e) {
      return undefined;
    }
  }
  // http://dbf.finalrewind.org/KD?mode=marudor&backend=iris&version=2
  function evaIdAbfahrten(evaId: string) {
    return axios.get(`http://dbf.finalrewind.org/${evaId}?mode=marudor&backend=iris&version=2`).then(d => {
      const departures = d.data.departures.map(dep => ({
        ...dep,
        id: `${dep.train}${dep.scheduledArrival}${dep.scheduledDeparture}`,
        trainId: getTrainNumber(dep.train),
        longDistance: longDistanceRegex.test(dep.train),
      }));

      return departures;
    });
  }

  router
    .prefix(prefix)
    // https://si.favendo.de/station-info/rest/api/search?searchTerm=Bochum
    .get('/search/:searchTerm', async ctx => {
      if (useTestData) {
        ctx.body = require('./testData/search');

        return;
      }
      const { searchTerm } = ctx.params;

      ctx.body = await stationSearch(searchTerm);
    })
    .get('/searchHAFAS/:searchTerm', async ctx => {
      if (useTestData) {
        ctx.body = require('./testData/search');

        return;
      }
      const { searchTerm } = ctx.params;

      ctx.body = await stationSearchHAFAS(searchTerm);
    })
    // https://si.favendo.de/station-info/rest/api/station/724
    .get('/station/:station', async ctx => {
      const { station } = ctx.params;

      ctx.body = await stationInfo(station);
    })
    .get('/abfahrten/:station', async ctx => {
      if (useTestData) {
        ctx.body = require('./testData/abfahrten');

        return;
      }
      const { station } = ctx.params;
      let evaId = station;

      if (evaId.length < 6) {
        const info = await stationInfo(station);

        evaId = info.evaId;
      }
      ctx.body = await evaIdAbfahrten(evaId);
    })
    .get('/wagenstation/:train/:station', async ctx => {
      const { train, station } = ctx.params;

      try {
        ctx.body = await wagenReihungStation([train], station);
      } catch (e) {
        ctx.body = e.response.data;
      }
    })
    .get('/wagen/:trainNumber/:date', async ctx => {
      if (useTestData) {
        ctx.body = require('./testData/reihung');

        return;
      }
      const { date, trainNumber } = ctx.params;

      try {
        ctx.body = await wagenReihung(trainNumber, date);
      } catch (e) {
        ctx.body = e.response.data;
      }
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

      try {
        ctx.body = await auslastung(trainNumber, date);
      } catch (e) {
        ctx.body = e.response.data;
      }
    });
  }

  koa.use(router.routes());
}
