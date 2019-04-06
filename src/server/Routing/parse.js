// @flow
import { addMilliseconds, differenceInMinutes, parse } from 'date-fns';
import { flatten } from 'lodash';
import type {
  Route,
  Route$Arrival,
  Route$Departure,
  Route$JourneySegment,
  SRoute$Arrival,
  SRoute$Departure,
  SRoute$Journey,
  SRoute$JourneySegment,
  SRoute$Result,
} from 'types/routing';
import type { Station } from 'types/station';

function parseDuration(duration: string) {
  const sanitized = duration.padStart(8, '0');
  const days = Number.parseInt(sanitized.slice(0, 2), 10);
  const hours = Number.parseInt(sanitized.slice(2, 4), 10);
  const minutes = Number.parseInt(sanitized.slice(4, 6), 10);
  const seconds = Number.parseInt(sanitized.slice(6, 8), 10);

  return (seconds + minutes * 60 + hours * 60 * 60 + days * 60 * 60 * 24) * 1000;
}

const nameRegex = /O=([^@]+)/;
const evaRegex = /L=(\d+)/;

function parseFullStation(fullStation: string): Station {
  return {
    // $FlowFixMe
    title: fullStation.match(nameRegex)?.[1],
    // $FlowFixMe
    id: fullStation.match(evaRegex)?.[1].padStart(7, '0'),
  };
}

class Journey {
  raw: SRoute$Journey;
  date: number;
  journey: Route;
  prodL: *;
  constructor(raw: SRoute$Journey, prodL) {
    this.raw = raw;
    this.prodL = prodL;
    this.date = parse(raw.date, 'yyyyMMdd', new Date()).getTime();
    const segments = raw.secL.map(this.parseSegment).filter(Boolean);

    this.journey = {
      cid: raw.cid,
      date: this.date,
      duration: parseDuration(raw.dur),
      changes: raw.chg,
      ...this.parseArrival(raw.arr),
      ...this.parseDeparture(raw.dep),
      segments,
      segmentTypes: segments.map(s => s.trainType),
      raw: PROD ? undefined : raw,
    };
  }
  parseSegment = (t: SRoute$JourneySegment): ?Route$JourneySegment => {
    switch (t.type) {
      case 'JNY': {
        const [
          // eslint-disable-next-line no-unused-vars
          T,
          fullStart,
          fullDestination,
          // eslint-disable-next-line no-unused-vars
          departureString,
          // eslint-disable-next-line no-unused-vars
          arrivalString,
          // eslint-disable-next-line no-unused-vars
          trainString,
          // eslint-disable-next-line no-unused-vars
          u1,
          // eslint-disable-next-line no-unused-vars
          u2,
          // eslint-disable-next-line no-unused-vars
          u3,
        ] = t.jny.ctxRecon.split('$');
        // const train = trainString.replace(/ +/g, ' ');

        const arrival = this.parseArrival(t.arr);
        const departure = this.parseDeparture(t.dep);

        const product = this.prodL[t.jny.prodX];

        return {
          train: product.addName || product.name,
          trainId: product.prodCtx.line,
          trainNumber: product.prodCtx.num,
          trainType: product.prodCtx.catOut,
          changeDuration: t.jny.chgDurR,
          segmentStart: parseFullStation(fullStart),
          segmentDestination: parseFullStation(fullDestination),
          ...arrival,
          ...departure,
          duration: arrival.scheduledArrival - departure.scheduledDeparture,
          finalDestination: t.jny.dirTxt,
          product: PROD ? undefined : product,
          raw: PROD ? undefined : t,
        };
      }
      // case 'WALK':
      default:
        return undefined;
    }
  };
  parseTime(time: string): number {
    return addMilliseconds(this.date, parseDuration(time)).getTime();
  }
  parseArrival(a: SRoute$Arrival): Route$Arrival {
    const scheduledArrival = this.parseTime(a.aTimeS);
    let arrival = scheduledArrival;
    let arrivalDelay = 0;

    if (a.aTimeR) {
      arrival = this.parseTime(a.aTimeR);
      arrivalDelay = differenceInMinutes(arrival, scheduledArrival);
    }

    return {
      scheduledArrivalPlatform: a.aPlatfS,
      arrivalPlatform: a.aPlatfR || a.aPlatfS,
      scheduledArrival,
      arrival,
      arrivalDelay,
    };
  }
  parseDeparture(d: SRoute$Departure): Route$Departure {
    const scheduledDeparture = this.parseTime(d.dTimeS);
    let departure = scheduledDeparture;
    let departureDelay = 0;

    if (d.dTimeR) {
      departure = this.parseTime(d.dTimeR);
      departureDelay = differenceInMinutes(departure, scheduledDeparture);
    }

    return {
      scheduledDeparturePlatform: d.dPlatfS,
      departurePlatform: d.dPlatfR || d.dPlatfS,
      scheduledDeparture,
      departure,
      departureDelay,
    };
  }
}

export default (r: SRoute$Result): Route[] => {
  const result = r.svcResL.map<any>(svc => svc.res.outConL.map(j => new Journey(j, svc.res.common.prodL).journey));

  return flatten(result);
};
