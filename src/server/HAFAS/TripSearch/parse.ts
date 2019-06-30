import { CommonStop, HafasResponse, ParsedCommon } from 'types/HAFAS';
import { flatten } from 'lodash';
import { Jny, OutConL, SecL, TripSearchResponse } from 'types/HAFAS/TripSearch';
import { parse } from 'date-fns';
import {
  Route,
  Route$Journey,
  Route$JourneySegment,
  Route$Stop,
  RoutingResult,
} from 'types/routing';
import { Station } from 'types/station';
import parseAuslastung from '../helper/parseAuslastung';
import parseCommonArrival from '../helper/parseCommonArrival';
import parseCommonDeparture from '../helper/parseCommonDeparture';
import parseDuration from '../helper/parseDuration';
import parseStop from '../helper/parseStop';

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

export class Journey {
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
      arrival: parseCommonArrival(raw.arr, this.date, common),
      departure: parseCommonDeparture(raw.dep, this.date, common),
      segments,
      segmentTypes: segments.map(s => s.train.type).filter(Boolean as any),
      raw: global.PROD ? undefined : raw,
    };
  }
  parseStops = (stops?: CommonStop[]): Route$Stop[] => {
    if (!stops) return [];

    return stops.map(stop => parseStop(stop, this.common, this.date));
  };
  parseSegmentJourney = (jny: Jny): Route$Journey => {
    const [, fullStart, fullDestination, , , , , , ,] = jny.ctxRecon.split('$');
    const product = this.common.prodL[jny.prodX];

    return {
      train: product,
      isCancelled: jny.isCncl,
      changeDuration: jny.chgDurR,
      segmentStart: parseFullStation(fullStart),
      segmentDestination: parseFullStation(fullDestination),
      stops: this.parseStops(jny.stopL),
      finalDestination: jny.dirTxt,
      jid: jny.jid,
      auslastung: parseAuslastung(jny.dTrnCmpSX, this.common.tcocL),
    };
  };
  parseSegment = (t: SecL): undefined | Route$JourneySegment => {
    switch (t.type) {
      case 'JNY': {
        const arrival = parseCommonArrival(
          t.arr,
          this.date,
          this.common,
          this.common.prodL[t.jny.prodX].type
        );
        const departure = parseCommonDeparture(
          t.dep,
          this.date,
          this.common,
          this.common.prodL[t.jny.prodX].type
        );

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
          ...this.parseSegmentJourney(t.jny),
        };
      }
      // case 'WALK':
      default:
        return undefined;
    }
  };
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
