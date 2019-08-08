/* eslint no-continue: 0 */
/*
 ** This algorithm is heavily inspired by https://github.com/derf/Travel-Status-DE-IRIS
 ** derf did awesome work reverse engineering the XML stuff!
 */
import { Abfahrt, Train } from 'types/abfahrten';
import {
  addHours,
  addMinutes,
  compareAsc,
  compareDesc,
  format,
  isAfter,
  isBefore,
  parse,
  subHours,
  subMinutes,
} from 'date-fns';
import { AxiosInstance } from 'axios';
import { diffArrays } from 'diff';
import { findLast, flatten, last, uniqBy } from 'lodash';
import { getAttr, getNumberAttr, parseTs } from './helper';
import { getCachedLageplan, getLageplan } from '../Bahnhof/Lageplan';
import idx from 'idx';
import messageLookup, {
  messageTypeLookup,
  supersededMessages,
} from './messageLookup';
import NodeCache from 'node-cache';
import xmljs from 'libxmljs2';

export type Result = {
  departures: Abfahrt[];
  lookbehind: Abfahrt[];
  wings: Object;
  lageplan?: null | string;
};

type ArDp = {
  platform?: string;
  status?: string;
};
type ParsedDp = ArDp & {
  departureTs?: string;
  scheduledDepartureTs?: string;
  routePost?: string[];
};

type ParsedAr = ArDp & {
  arrivalTs?: string;
  scheduledArrivalTs?: string;
  routePre?: string[];
};

// 6 Hours in seconds
const stdTTL = 6 * 60 * 60;
const timetableCache = new NodeCache({ stdTTL });

type Route = {
  name: string;
  cancelled?: boolean;
  additional?: boolean;
};

export type TimetableOptions = {
  lookahead: number;
  lookbehind: number;
  currentDate?: Date;
};

const routeMap: (s: string) => Route = name => ({ name });
const normalizeRouteName = (name: string) =>
  name
    .replace('(', ' (')
    .replace(')', ') ')
    .trim();

export function parseDp(dp: null | xmljs.Element): undefined | ParsedDp {
  if (!dp) return undefined;

  const routePost = getAttr(dp, 'cpth');

  return {
    departureTs: getAttr(dp, 'ct'),
    scheduledDepartureTs: getAttr(dp, 'pt'),
    platform: getAttr(dp, 'cp'),
    routePost: routePost
      ? routePost.split('|').map<string>(normalizeRouteName)
      : undefined,
    // plannedRoutePost: getAttr(dp, 'ppth')?.split('|'),
    status: getAttr(dp, 'cs'),
  };
}

export function parseRealtimeAr(
  ar: null | xmljs.Element
): undefined | ParsedAr {
  if (!ar) return undefined;

  const routePre = getAttr(ar, 'cpth');

  return {
    arrivalTs: getAttr(ar, 'ct'),
    scheduledArrivalTs: getAttr(ar, 'pt'),
    platform: getAttr(ar, 'cp'),
    routePre: routePre
      ? routePre.split('|').map<string>(normalizeRouteName)
      : undefined,
    // plannedRoutePre: getAttr(ar, 'ppth')?.split('|'),
    status: getAttr(ar, 'cs'),
    // statusSince: getAttr(ar, 'clt'),
  };
}

const trainRegex = /(BRB?|\w+?)?? ?(Bus|RS|IRE|RE|RB|IC|ICE|EC|ECE|TGV|NJ|RJ|S)? ?(\d+\w*|SEV)/;

function getTrainType(thirdParty?: string, trainType?: string) {
  if ((thirdParty === 'NWB' && trainType === 'RS') || thirdParty === 'BSB') {
    return 'S';
  }
  if (thirdParty === 'FLX') {
    return 'IR';
  }
  if (thirdParty) {
    return 'RB';
  }

  return trainType;
}

function getTrainLine(
  thirdParty?: string,
  rawTrainType?: string,
  trainLine?: string
) {
  if (thirdParty === 'NWB' && rawTrainType === 'RS') {
    return `${rawTrainType}${trainLine}`;
  }

  return trainLine || undefined;
}

export function splitTrainType(train: string = '', trainNumber: string = '') {
  const parsed = trainRegex.exec(train);

  if (parsed) {
    const thirdParty = parsed[1] || undefined;
    const type = getTrainType(thirdParty, parsed[2]);
    const line = getTrainLine(thirdParty, parsed[2], parsed[3]);

    return {
      thirdParty,
      type,
      line: line === trainNumber ? undefined : line,
    };
  }

  return {
    thirdParty: undefined,
    type: undefined,
    line: undefined,
  };
}

export function parseTl(tl: xmljs.Element) {
  return {
    // D = Irregular, like third party
    // N = Nahverkehr
    // S = Sbahn
    // F = Fernverkehr
    productClass: getAttr(tl, 'f'),
    o: getAttr(tl, 'o'),
    t: getAttr(tl, 't'),
    trainNumber: getAttr(tl, 'n') || '',
    trainCategory: getAttr(tl, 'c') || '',
  };
}

const idRegex = /-?(\w+)/;
const mediumIdRegex = /-?(\w+-\w+)/;
const initialDepartureRegex = /-?\w+-(\w+)/;

function parseRawId(rawId: string) {
  const idMatch = rawId.match(idRegex);
  const mediumIdMatch = rawId.match(mediumIdRegex);
  const initialDepartureMatch = rawId.match(initialDepartureRegex);

  return {
    id: (idMatch && idMatch[1]) || rawId,
    mediumId: (mediumIdMatch && mediumIdMatch[1]) || rawId,
    initialDeparture:
      (initialDepartureMatch &&
        parse(initialDepartureMatch[1], 'yyMMddHHmm', 0).getTime()) ||
      '',
  };
}

const longDistanceRegex = /(ICE?|TGV|ECE?|RJ|D).*/;

export default class Timetable {
  errors: any[] = [];
  axios: AxiosInstance;
  timetable: {
    [key: string]: any;
  } = {};
  realtimeIds: string[] = [];
  evaId: string;
  segments: Date[];
  currentStation: string;
  wingIds: Set<string> = new Set();
  currentDate: Date;
  maxDate: Date;
  minDate: Date;

  constructor(
    evaId: string,
    currentStation: string,
    options: TimetableOptions,
    axios: AxiosInstance
  ) {
    this.axios = axios;
    this.evaId = evaId;
    this.currentDate = options.currentDate || new Date();
    this.maxDate = addMinutes(this.currentDate, options.lookahead);
    this.minDate = subMinutes(this.currentDate, options.lookbehind);
    this.segments = [this.currentDate];
    for (let i = 1; i <= Math.ceil(options.lookahead / 60); i += 1) {
      this.segments.push(addHours(this.currentDate, i));
    }
    for (let i = 1; i <= Math.ceil((options.lookbehind || 1) / 60); i += 1) {
      this.segments.push(subHours(this.currentDate, i));
    }
    this.currentStation = normalizeRouteName(currentStation);
  }
  computeExtra(timetable: any) {
    timetable.cancelled =
      (timetable.arrival &&
        timetable.arrival.cancelled &&
        (!timetable.departure ||
          timetable.departure.cancelled ||
          !timetable.departure.scheduledTime)) ||
      (timetable.departure &&
        timetable.departure.cancelled &&
        (!timetable.arrival || !timetable.arrival.scheduledTime));

    if (timetable.cancelled) {
      const anyCancelled =
        timetable.routePre.some((r: any) => r.cancelled) ||
        timetable.routePost.some((r: any) => r.cancelled);

      if (anyCancelled) {
        timetable.routePre.forEach((r: any) => (r.cancelled = true));
        timetable.routePost.forEach((r: any) => (r.cancelled = true));
      }
    }

    timetable.route = [
      ...timetable.routePre,
      {
        name: timetable.currentStation.title,
        cancelled: timetable.cancelled,
        additional: timetable.additional,
      },
      ...timetable.routePost,
    ];
    const last = findLast(timetable.route, r => !r.cancelled);

    timetable.destination =
      (last && last.name) || timetable.scheduledDestination;
    this.calculateVia(timetable);

    if (timetable.departure) {
      timetable.platform = timetable.departure.platform;
      timetable.scheduledPlatform = timetable.departure.scheduledPlatform;
    } else if (timetable.arrival) {
      timetable.platform = timetable.arrival.platform;
      timetable.scheduledPlatform = timetable.arrival.scheduledPlatform;
    }

    timetable.auslastung =
      !timetable.cancelled &&
      timetable.train.longDistance &&
      timetable.departure &&
      !timetable.departure.hidden;
    timetable.reihung = !timetable.cancelled && timetable.train.longDistance;
    timetable.hiddenReihung = ['RB', 'RE', 'IRE'].includes(
      timetable.train.type
    );

    delete timetable.routePre;
    delete timetable.routePost;
    if (timetable.arrival) {
      delete timetable.arrival.additional;
    }
    if (timetable.departure) {
      delete timetable.departure.additional;
    }
  }
  async start(skipLageplan: boolean = false): Promise<Result> {
    const lageplan = getCachedLageplan(this.currentStation);

    if (!skipLageplan && lageplan === undefined) {
      getLageplan(this.currentStation);
    }
    await this.getTimetables();
    await this.getRealtime();

    const timetables: any[] = Object.values(this.timetable);

    timetables
      .filter(t => !this.realtimeIds.includes(t.rawId))
      .forEach(t => {
        t.messages = {
          qos: [],
          delay: [],
        };
        // t.platform = t.scheduledPlatform;
      });

    const wings: { [key: string]: any } = {};

    const departures = [] as any[];
    const lookbehind = [] as any[];

    uniqBy(timetables, 'rawId').forEach((a: any) => {
      const isWing = this.wingIds.has(a.mediumId);

      if (isWing) {
        wings[a.mediumId] = a;
        this.computeExtra(a);

        return;
      }

      const scheduledArrvial = idx(a, _ => _.arrival.scheduledTime);
      const arrival = idx(a, _ => _.arrival.time);
      const scheduledDeparture = idx(a, _ => _.departure.scheduledTime);
      const departure = idx(a, _ => _.departure.time);
      // @ts-ignore we know that either arrival or departure exists
      const time: number = idx(a, _ => _.departure.cancelled)
        ? scheduledArrvial || scheduledDeparture
        : scheduledDeparture || scheduledArrvial;
      // @ts-ignore we know that either arrival or departure exists
      const realTime: number = idx(a, _ => _.departure.cancelled)
        ? arrival || departure
        : departure || arrival;

      if (isAfter(realTime, this.minDate) && isBefore(time, this.maxDate)) {
        if (isBefore(realTime, this.currentDate)) {
          lookbehind.push(a);
        } else {
          departures.push(a);
        }
      }
    });

    departures.forEach((t: any) => this.computeExtra(t));
    lookbehind.forEach((t: any) => this.computeExtra(t));

    return {
      departures,
      lookbehind,
      wings,
      lageplan,
    };
  }
  calculateVia(timetable: any, maxParts: number = 3) {
    const via: Train[] = [...timetable.routePost].filter(v => !v.cancelled);

    via.pop();
    const important = via.filter(v =>
      v.name.match(/(HB$|Hbf|Centraal|Flughafen)/)
    );

    const showing = [];

    if (important.length >= maxParts) {
      showing.push(via[0]);
    } else {
      showing.push(...via.splice(0, maxParts - important.length));
    }

    while (showing.length < maxParts && important.length) {
      // @ts-ignore this is correct
      const stop: Train = important.shift();

      if (!showing.includes(stop)) {
        showing.push(stop);
      }
    }
    showing.forEach(v => (v.showVia = true));
  }
  parseRef(tl: xmljs.Element) {
    const { trainCategory, trainNumber } = parseTl(tl);
    const train = `${trainCategory} ${trainNumber}`;

    return {
      trainType: trainCategory,
      trainNumber,
      train,
    };
  }
  parseMessage(mNode: xmljs.Element) {
    const value = getNumberAttr(mNode, 'c');
    const indexType = getAttr(mNode, 't');

    if (!indexType) return undefined;
    const type: undefined | string =
      messageTypeLookup[indexType as keyof typeof messageTypeLookup];

    if (!type || !value || value <= 1) {
      return undefined;
    }

    const message = {
      superseded: undefined,
      // @ts-ignore Lookup is correct
      text: messageLookup[value] || `${value} (?)`,
      timestamp: parseTs(getAttr(mNode, 'ts')),
      priority: getAttr(mNode, 'pr'),
    };

    return {
      type,
      value,
      message,
    };
  }
  parseRealtimeS(sNode: xmljs.Element) {
    const rawId = getAttr(sNode, 'id');

    if (!rawId) return;
    const { id, mediumId, initialDeparture } = parseRawId(rawId);
    const tl = sNode.get('tl');
    const ref = sNode.get('ref/tl');

    if (!this.timetable[rawId] && tl) {
      const timetable = this.parseTimetableS(sNode);

      if (timetable) {
        timetable.additional = !timetable.substitute;
        this.timetable[rawId] = timetable;
      }
    }

    if (!this.timetable[rawId]) {
      return;
    }

    const ar = sNode.get('ar');
    const dp = sNode.get('dp');
    // @ts-ignore this is correct
    const mArr: xmljs.Element[] = sNode.find(`${sNode.path()}//m`);

    if (!mArr) return;
    const messages: {
      [key: string]: {
        [key: number]: any;
      };
    } = {
      delay: {},
      qos: {},
    };

    mArr
      .map(m => this.parseMessage(m))
      .filter((Boolean as any) as ExcludesFalse)
      .sort((a, b) =>
        compareAsc(a.message.timestamp || 0, b.message.timestamp || 0)
      )
      .forEach(({ type, message, value }) => {
        // @ts-ignore
        const supersedes: undefined | number[] = supersededMessages[value];

        if (!messages[type]) messages[type] = {};
        if (supersedes) {
          supersedes.forEach(v => {
            if (messages[type][v]) {
              messages[type][v].superseded = true;
            }
          });
        }
        messages[type][value] = message;
      });

    return {
      id,
      mediumId,
      rawId,
      initialDeparture,
      messages: Object.keys(messages).reduce(
        (agg, messageKey) => {
          const messageValues = Object.values(messages[messageKey]);

          agg[messageKey] = messageValues.sort((a, b) =>
            compareDesc(a.timestamp, b.timestamp)
          );

          return agg;
        },
        {} as { [key: string]: any[] }
      ),
      arrival: parseRealtimeAr(ar),
      departure: parseDp(dp),
      ref: ref ? this.parseRef(ref) : undefined,
    };
  }
  addArrivalInfo(timetable: any, ar: undefined | ParsedAr) {
    if (!ar) return;
    if (!timetable.arrival) timetable.arrival = {};
    timetable.arrival.cancelled = ar.status === 'c';
    timetable.arrival.additional = ar.status === 'a';
    if (ar.scheduledArrivalTs) {
      timetable.arrival.scheduledTime = parseTs(ar.scheduledArrivalTs);
      timetable.arrival.time = timetable.arrival.scheduledTime;
    }
    if (ar.arrivalTs) {
      timetable.arrival.time = parseTs(ar.arrivalTs);
    }
    timetable.arrival.delay =
      (timetable.arrival.time - timetable.arrival.scheduledTime) / 60 / 1000;
    if (ar.routePre) {
      const diff = diffArrays(
        ar.routePre,
        timetable.routePre.map((r: any) => r.name)
      );

      timetable.routePre = flatten(
        diff.map(d =>
          d.value.map(v => ({
            name: v,
            additional: d.removed,
            cancelled: d.added,
          }))
        )
      );
    }
    timetable.arrival.platform =
      ar.platform || timetable.arrival.scheduledPlatform;
    // timetable.platform = ar.platform || timetable.scheduledPlatform;
  }
  addDepartureInfo(timetable: any, dp: undefined | ParsedDp) {
    if (!dp) return;
    if (!timetable.departure) timetable.departure = {};
    timetable.departure.cancelled = dp.status === 'c';
    timetable.departure.additional = dp.status === 'a';
    if (dp.scheduledDepartureTs) {
      timetable.departure.scheduledTime = parseTs(dp.scheduledDepartureTs);
      timetable.departure.time = timetable.departure.scheduledTime;
    }
    if (dp.departureTs) {
      timetable.departure.time = parseTs(dp.departureTs);
    }
    timetable.departure.delay =
      (timetable.departure.time - timetable.departure.scheduledTime) /
      60 /
      1000;
    if (dp.routePost) {
      const diff = diffArrays(
        timetable.routePost.map((r: any) => r.name),
        dp.routePost
      );

      timetable.routePost = flatten(
        diff.map(d =>
          d.value.map(v => ({
            name: v,
            additional: d.added,
            cancelled: d.removed || timetable.departure.cancelled,
          }))
        )
      );
    } else if (timetable.departure.cancelled && timetable.routePost) {
      timetable.routePost.forEach((r: any) => (r.cancelled = true));
    }
    timetable.departure.platform =
      dp.platform || timetable.departure.scheduledPlatform;
    // timetable.platform = dp.platform || timetable.scheduledPlatform;
  }
  async fetchRealtime() {
    const url = `/fchg/${this.evaId}`;

    const result = await this.axios.get(url).then(x => x.data);

    if (result.includes('<soapenv:Reason')) {
      return Promise.reject(result);
    }

    return result;
  }
  async getRealtime() {
    const rawXml = await this.fetchRealtime();
    const realtimeXml = xmljs.parseXml(rawXml);
    const sArr = realtimeXml.find('/timetable/s');

    if (!sArr) return;

    sArr.forEach(s => {
      const realtime = this.parseRealtimeS(s);

      if (!realtime) return;
      const timetable = this.timetable[realtime.rawId];

      if (!timetable) return;
      this.realtimeIds.push(realtime.rawId);
      this.addArrivalInfo(timetable, realtime.arrival);
      this.addDepartureInfo(timetable, realtime.departure);
      timetable.messages = realtime.messages;
      timetable.ref = realtime.ref;
    });
  }
  getWings(node: null | xmljs.Element, displayAsWing: boolean) {
    const wingAttr = getAttr(node, 'wings');

    if (!wingAttr) return;
    const rawWings = wingAttr.split('|');

    const mediumWings = rawWings.map<string>(w => parseRawId(w).mediumId);

    if (displayAsWing) {
      mediumWings.forEach(i => this.wingIds.add(i));
    }

    return mediumWings;
  }
  parseTimetableS(sNode: xmljs.Element) {
    const rawId = getAttr(sNode, 'id');

    if (!rawId) {
      return undefined;
    }
    const { id, mediumId, initialDeparture } = parseRawId(rawId);
    const tl = sNode.get('tl');

    if (!tl) {
      return undefined;
    }
    const ar = sNode.get('ar');
    const dp = sNode.get('dp');

    const scheduledArrival = parseTs(getAttr(ar, 'pt'));
    const scheduledDeparture = parseTs(getAttr(dp, 'pt'));
    const lineNumber = getAttr(dp || ar, 'l');
    const { trainNumber, trainCategory, t, o, productClass } = parseTl(tl);
    const fullTrainText = `${trainCategory} ${lineNumber || trainNumber}`;

    function getNormalizedRoute(node: null | xmljs.Element) {
      const rawRoute = getAttr(node, 'ppth');

      return (rawRoute ? rawRoute.split('|') : []).map(normalizeRouteName);
    }

    const routePost = getNormalizedRoute(dp);
    const routePre = getNormalizedRoute(ar);

    return {
      o,
      initialDeparture,
      arrival: scheduledArrival && {
        scheduledTime: scheduledArrival,
        time: scheduledArrival,
        wingIds: this.getWings(ar, false),
        platform: getAttr(ar, 'pp'),
        scheduledPlatform: getAttr(ar, 'pp'),
        hidden: Boolean(getAttr(ar, 'hi')),
      },
      departure: scheduledDeparture && {
        scheduledTime: scheduledDeparture,
        time: scheduledDeparture,
        wingIds: this.getWings(dp, true),
        platform: getAttr(dp, 'pp'),
        scheduledPlatform: getAttr(dp, 'pp'),
        hidden: Boolean(getAttr(dp, 'hi')),
      },
      productClass,
      // classes: getAttr(tl, 'f'),
      currentStation: {
        title: this.currentStation,
        id: this.evaId,
      },
      scheduledDestination: last(routePost) || this.currentStation,
      lineNumber,
      id,
      rawId,
      mediumId,
      // routeEnd: getAttr(dp, 'pde'),
      routePost: routePost.map<Route>(routeMap),
      routePre: routePre.map<Route>(routeMap),
      // routeStart: getAttr(ar, 'pde'),
      // transfer: getAttr(dp || ar, 'tra'),
      substitute: t === 'e',
      train: {
        longDistance: longDistanceRegex.test(fullTrainText),
        name: fullTrainText,
        number: trainNumber,
        trainCategory,
        ...splitTrainType(fullTrainText, trainNumber),
      },
      additional: undefined as (undefined | boolean),
    };
  }
  getTimetable(rawXml: string) {
    const timetableXml = xmljs.parseXml(rawXml);

    const sArr = timetableXml.find('/timetable/s');

    const timetables: { [key: string]: any } = {};

    if (sArr) {
      sArr.forEach(s => {
        const departure = this.parseTimetableS(s);

        if (!departure) return;
        timetables[departure.rawId] = departure;
      });
    }

    return timetables;
  }
  getTimetables() {
    return Promise.all(
      this.segments.map(async date => {
        const key = `/plan/${this.evaId}/${format(date, 'yyMMdd/HH')}`;
        let rawXml = timetableCache.get<any>(key);

        if (!rawXml) {
          try {
            rawXml = await this.axios.get<string>(key).then(x => x.data);
          } catch (e) {
            this.errors.push(e);

            return;
          }
        }

        this.timetable = {
          ...this.timetable,
          ...this.getTimetable(rawXml),
        };
        timetableCache.set<string>(key, rawXml);
      })
    );
  }
}
