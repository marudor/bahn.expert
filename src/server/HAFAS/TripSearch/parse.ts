import {
  CommonStop,
  CommonStopInfo,
  HafasResponse,
  ParsedCommon,
} from 'types/HAFAS';
import { Jny, OutConL, SecL, TripSearchResponse } from 'types/HAFAS/TripSearch';
import { parse } from 'date-fns';
import {
  Route$Journey,
  Route$JourneySegment,
  Route$Stop,
  RoutingResult,
  SingleRoute,
} from 'types/routing';
import { Station } from 'types/station';
import mergeSegments from 'server/HAFAS/TripSearch/mergeSegments';
import parseAuslastung from '../helper/parseAuslastung';
import parseCommonArrival from '../helper/parseCommonArrival';
import parseCommonDeparture from '../helper/parseCommonDeparture';
import parseDuration from '../helper/parseDuration';
import parseMessages from '../helper/parseMessages';
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

function adjustToFirstTrain(
  departure: CommonStopInfo,
  segments: Route$JourneySegment[]
) {
  if (segments.length && segments[0].type !== 'JNY') {
    const firstTrainSegment = segments.find(s => s.type === 'JNY');

    if (firstTrainSegment) {
      departure.delay = firstTrainSegment.arrival.delay;
    }
  }
}

function adjustToLastTrain(
  arrival: CommonStopInfo,
  segments: Route$JourneySegment[]
) {
  if (segments.length && segments[segments.length - 1].type !== 'JNY') {
    const allTrainSegments = segments.filter(s => s.type === 'JNY');

    if (allTrainSegments.length) {
      const lastTrainSegment = allTrainSegments[allTrainSegments.length - 1];

      arrival.delay = lastTrainSegment.arrival.delay;
    }
  }
}

export class Journey {
  raw: OutConL;
  date: Date;
  journey: SingleRoute;
  common: ParsedCommon;
  constructor(raw: OutConL, common: ParsedCommon) {
    this.raw = raw;
    this.common = common;
    this.date = parse(raw.date, 'yyyyMMdd', new Date());
    const allSegments = raw.secL
      .map(this.parseSegment)
      .filter<Route$JourneySegment>(Boolean as any);

    const segments = mergeSegments(allSegments);

    const arrival = parseCommonArrival(raw.arr, this.date, common);
    const departure = parseCommonDeparture(raw.dep, this.date, common);

    adjustToFirstTrain(departure, segments);
    adjustToLastTrain(arrival, segments);

    this.journey = {
      checksum: raw.cksum,
      cid: raw.cid,
      date: this.date.getTime(),
      duration: parseDuration(raw.dur),
      changes: raw.chg,
      isRideable: !raw.isNotRdbl,
      arrival,
      departure,
      segments,
      segmentTypes: segments
        .map(s => (s.type === 'JNY' ? s.train.type : s.train.name))
        .filter(Boolean as any),
      raw: global.PROD ? undefined : raw,
    };
  }
  parseStops = (stops?: CommonStop[], trainType?: string): Route$Stop[] => {
    if (!stops) return [];

    return stops.map(stop =>
      parseStop(stop, this.common, this.date, trainType)
    );
  };
  parseSegmentJourney = (jny: Jny): Route$Journey => {
    const [, fullStart, fullDestination, , , , , , ,] = jny.ctxRecon.split('$');
    const product = this.common.prodL[jny.prodX];

    return {
      train: product,
      cancelled: jny.isCncl,
      changeDuration: jny.chgDurR,
      segmentStart: parseFullStation(fullStart),
      segmentDestination: parseFullStation(fullDestination),
      stops: this.parseStops(jny.stopL, product.type),
      finalDestination: jny.dirTxt,
      jid: jny.jid,
      auslastung: parseAuslastung(jny.dTrnCmpSX, this.common.tcocL),
      messages: parseMessages(jny.msgL, this.common),
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
          // reservationStatus: t.resState,
          // reservationRecommandation: t.resRecommendation,
          // icoX: this.common.icoL[t.icoX],
          ...this.parseSegmentJourney(t.jny),
          type: 'JNY',
        };
      }
      case 'TRSF':
      case 'WALK':
        return {
          type: 'WALK',
          train: {
            name: 'Fußweg',
            type: 'Fußweg',
          },
          arrival: parseCommonArrival(t.arr, this.date, this.common),
          departure: parseCommonDeparture(t.dep, this.date, this.common),
          duration: parseDuration(t.gis.durS),
          segmentStart: this.common.locL[t.dep.locX],
          segmentDestination: this.common.locL[t.arr.locX],
        };
      default:
        return undefined;
    }
  };
}

export default (
  r: HafasResponse<TripSearchResponse>,
  parsedCommon: ParsedCommon
): RoutingResult => {
  const routes = r.svcResL[0].res.outConL.flatMap(
    j => new Journey(j, parsedCommon).journey
  );

  return {
    context: {
      earlier: r.svcResL[0].res.outCtxScrB,
      later: r.svcResL[0].res.outCtxScrF,
    },
    routes,
  };
};
