import {
  Arr,
  Dep,
  Jny,
  OutConL,
  SecL,
  StopL,
  TripSearchResponse,
  TrnCmpSX,
} from 'types/HAFAS/TripSearch';
import { flatten } from 'lodash';
import { HafasResponse, ParsedCommon } from 'types/HAFAS';
import { parse } from 'date-fns';
import {
  Route,
  Route$Journey,
  Route$JourneySegment,
  Route$Stop,
  Route$StopInfo,
  RoutingResult,
} from 'types/routing';
import { Station } from 'types/station';
import parseCommonArrival from '../helper/parseCommonArrival';
import parseCommonDeparture from '../helper/parseCommonDeparture';
import parseDuration from '../helper/parseDuration';
import parseProduct from '../helper/parseProduct';

const nameRegex = /O=([^@]+)/;
const evaRegex = /L=(\d+)/;

function parseFullStation(fullStation: string): Station {
  const titleMatch = fullStation.match(nameRegex);
  const idMatch = fullStation.match(evaRegex);

  let title = '';
  let id = '';

  if (titleMatch && titleMatch[1]) title = titleMatch[1];
  if (idMatch && idMatch[1]) id = idMatch[1].padStart(7, '0');

  return {
    title,
    id,
  };
}

class Journey {
  raw: OutConL;
  date: number;
  journey: Route;
  common: ParsedCommon;
  constructor(raw: OutConL, common: ParsedCommon) {
    this.raw = raw;
    this.common = common;
    this.date = parse(raw.date, 'yyyyMMdd', new Date()).getTime();
    const segments = raw.secL
      .map(this.parseSegment)
      .filter<Route$JourneySegment>(Boolean as any);

    this.journey = {
      checksum: raw.cksum,
      cid: raw.cid,
      date: this.date,
      duration: parseDuration(raw.dur),
      changes: raw.chg,
      isRideable: !raw.isNotRdbl,
      arrival: this.parseArrival(raw.arr),
      departure: this.parseDeparture(raw.dep),
      segments,
      segmentTypes: segments.map(s => s.trainType),
      raw: global.PROD ? undefined : raw,
    };
  }
  parseStops = (stops?: StopL[]): Route$Stop[] | undefined => {
    if (!stops) return;

    return stops.map(stop => ({
      station: this.common.locL[stop.locX],
      arrival: stop.aTimeS ? this.parseArrival(stop) : undefined,
      departure: stop.dTimeS ? this.parseDeparture(stop) : undefined,
    }));
  };
  parseAuslastung(dTrnCmpSX?: TrnCmpSX) {
    const tcocL = this.common.tcocL;

    if (!tcocL || !dTrnCmpSX || !dTrnCmpSX.tcocX) return;
    const auslastung: {
      first?: number;
      second?: number;
    } = {};

    dTrnCmpSX.tcocX.forEach(i => {
      const a = tcocL[i];

      switch (a.c) {
        case 'FIRST':
          auslastung.first = a.r;
          break;
        case 'SECOND':
          auslastung.second = a.r;
          break;
        default:
          break;
      }
    });

    return auslastung;
  }
  parseSegmentJourney = (jny: Jny): Route$Journey => {
    const [, fullStart, fullDestination, , , , , , ,] = jny.ctxRecon.split('$');
    const product = this.common.prodL[jny.prodX];

    return {
      ...parseProduct(product),
      isCancelled: jny.isCncl,
      changeDuration: jny.chgDurR,
      segmentStart: parseFullStation(fullStart),
      segmentDestination: parseFullStation(fullDestination),
      stops: this.parseStops(jny.stopL),
      finalDestination: jny.dirTxt,
      jid: jny.jid,
      auslastung: this.parseAuslastung(jny.dTrnCmpSX),
      product: global.PROD ? undefined : product,
    };
  };
  parseSegment = (t: SecL): undefined | Route$JourneySegment => {
    switch (t.type) {
      case 'JNY': {
        const arrival = this.parseArrival(t.arr);
        const departure = this.parseDeparture(t.dep);

        return {
          arrival,
          departure,
          duration:
            arrival.scheduledTime &&
            departure.scheduledTime &&
            arrival.scheduledTime - departure.scheduledTime,
          wings: t.parJnyL
            ? t.parJnyL.map(this.parseSegmentJourney)
            : undefined,
          // messages: t.jny.msgL.map(m => ({
          //   ...m,
          //   remXX: this.common.remL[m.remX],
          // })),
          // reservationStatus: t.resState,
          // reservationRecommandation: t.resRecommendation,
          // icoX: this.common.icoL[t.icoX],
          raw: global.PROD ? undefined : t,
          ...this.parseSegmentJourney(t.jny),
        };
      }
      // case 'WALK':
      default:
        return undefined;
    }
  };
  parseArrival(a: Arr): Route$StopInfo {
    return {
      ...parseCommonArrival(a, this.date),
      reihung: Boolean(a.aTrnCmpSX && a.aTrnCmpSX.tcM),
    };
  }
  parseDeparture(d: Dep): Route$StopInfo {
    return {
      ...parseCommonDeparture(d, this.date),
      reihung: Boolean(d.dTrnCmpSX && d.dTrnCmpSX.tcM),
    };
  }
}

export default (
  r: HafasResponse<TripSearchResponse>,
  parsedCommon: ParsedCommon
): RoutingResult => {
  const routes = r.svcResL[0].res.outConL.map(
    j => new Journey(j, parsedCommon).journey
  );

  return {
    context: {
      earlier: r.svcResL[0].res.outCtxScrB,
      later: r.svcResL[0].res.outCtxScrF,
    },
    routes: flatten(routes),
  };
};
