/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint no-continue: 0 */
/*
 ** This algorithm is heavily inspired by https://github.com/derf/Travel-Status-DE-IRIS
 ** derf did awesome work reverse engineering the XML stuff!
 */
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
import { CacheDatabases, createNewCache } from 'server/cache';
import {
  calculateVia,
  getAttr,
  getNumberAttr,
  getTsOfNode,
  irisGetRequest,
  parseTs,
} from './helper';
import { diffArrays } from 'diff';
import { getLineFromNumber } from 'server/journeys/lineNumberMapping';
import { getSingleHimMessageOfToday } from 'server/HAFAS/HimSearch';
import { getSingleStation } from 'server/iris/station';
import {
  ignoredMessageNumbers,
  messages,
  messageTypeLookup,
  supersededMessages,
} from './messageLookup';
import { uniqBy } from 'client/util';
import xmljs from 'libxmljs2';
import type { AbfahrtenResult, IrisMessage, Messages } from 'types/iris';
import type { Element } from 'libxmljs2';

interface ArDp {
  platform?: string;
  status?: string;
}
type ParsedDp = ArDp & {
  departureTs?: string;
  scheduledDepartureTs?: string;
  routePost?: string[];
  plannedRoutePost?: string[];
};

type ParsedAr = ArDp & {
  arrivalTs?: string;
  scheduledArrivalTs?: string;
  routePre?: string[];
  plannedRoutePre?: string[];
};

// 6 Hours in seconds
const timetableCache = createNewCache<string, Record<string, any>>(
  CacheDatabases.TimetableParsedPlan,
  6 * 60 * 60,
);

interface Route {
  name: string;
  cancelled?: boolean;
  additional?: boolean;
}

export interface TimetableOptions {
  lookahead: number;
  lookbehind: number;
  currentDate?: Date;
}

const processRawRouteString = (rawRouteString?: string) =>
  rawRouteString?.split('|').filter(Boolean).map(normalizeRouteName);
const routeMap: (s: string) => Route = (name) => ({ name });
const normalizeRouteName = (name: string) =>
  name.replace('(', ' (').replace(')', ') ').trim();
const deNormalizeRouteName = (name: string) =>
  name.replace(' (', '(').replace(') ', ')');

export function parseRealtimeDp(
  dp: null | xmljs.Element,
): undefined | ParsedDp {
  if (!dp) return undefined;

  return {
    departureTs: getAttr(dp, 'ct'),
    scheduledDepartureTs: getAttr(dp, 'pt'),
    platform: getAttr(dp, 'cp'),
    routePost: processRawRouteString(getAttr(dp, 'cpth')),
    plannedRoutePost: processRawRouteString(getAttr(dp, 'ppth')),
    status: getAttr(dp, 'cs'),
  };
}

export function parseRealtimeAr(
  ar: null | xmljs.Element,
): undefined | ParsedAr {
  if (!ar) return undefined;

  return {
    arrivalTs: getAttr(ar, 'ct'),
    scheduledArrivalTs: getAttr(ar, 'pt'),
    platform: getAttr(ar, 'cp'),
    routePre: processRawRouteString(getAttr(ar, 'cpth')),
    plannedRoutePre: processRawRouteString(getAttr(ar, 'ppth')),
    status: getAttr(ar, 'cs'),
    // statusSince: getAttr(ar, 'clt'),
  };
}

function parseTl(tl: xmljs.Element) {
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
  const idMatch = idRegex.exec(rawId);
  const mediumIdMatch = mediumIdRegex.exec(rawId);
  const initialDepartureMatch = initialDepartureRegex.exec(rawId);

  return {
    id: (idMatch && idMatch[1]) || rawId,
    mediumId: (mediumIdMatch && mediumIdMatch[1]) || rawId,
    initialDeparture:
      initialDepartureMatch && initialDepartureMatch[1]
        ? parse(initialDepartureMatch[1], 'yyMMddHHmm', Date.now())
        : undefined,
  };
}

export class Timetable {
  errors: any[] = [];
  timetable: {
    [key: string]: any;
  } = {};
  realtimeIds: string[] = [];
  segments: Date[];
  currentStopPlaceName: string;
  wingIds: Map<string, string> = new Map();
  currentDate: Date;
  maxDate: Date;
  minDate: Date;

  constructor(
    private evaNumber: string,
    currentStopPlaceName: string,
    options: TimetableOptions,
  ) {
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
    this.currentStopPlaceName = normalizeRouteName(currentStopPlaceName);
  }
  async computeExtra(timetable: any) {
    timetable.cancelled =
      (timetable.arrival &&
        timetable.arrival.cancelled &&
        (!timetable.departure ||
          timetable.departure.cancelled ||
          !timetable.departure.scheduledTime)) ||
      (timetable.departure &&
        timetable.departure.cancelled &&
        (!timetable.arrival || !timetable.arrival.scheduledTime));

    timetable.messages.him = timetable.messages.him.filter((m: any) => m.text);

    const currentRoutePart = {
      name: timetable.currentStopPlace.name,
      cancelled: timetable.cancelled,
      additional: timetable.additional,
    };

    timetable.route = [
      ...timetable.routePre,
      currentRoutePart,
      ...timetable.routePost,
    ];
    const nonCancelled = timetable.route.filter((r: any) => !r.cancelled);
    const last = nonCancelled.length
      ? nonCancelled[nonCancelled.length - 1]
      : undefined;

    timetable.destination = last?.name || timetable.scheduledDestination;
    calculateVia(timetable.routePost);

    if (timetable.departure) {
      if (
        !timetable.departure.cancelled &&
        timetable.destination === timetable.currentStopPlace.name
      ) {
        timetable.departure.cancelled = true;
      }
      timetable.platform = timetable.departure.platform;
      timetable.scheduledPlatform = timetable.departure.scheduledPlatform;
    } else if (timetable.arrival) {
      timetable.platform = timetable.arrival.platform;
      timetable.scheduledPlatform = timetable.arrival.scheduledPlatform;
    }

    delete timetable.routePre;
    delete timetable.routePost;
    if (timetable.arrival) {
      delete timetable.arrival.additional;
    }
    if (timetable.departure) {
      delete timetable.departure.additional;
    }

    try {
      const firstStop = timetable.route[0];
      const stopOfFirst = await getSingleStation(
        deNormalizeRouteName(firstStop.name),
      );
      timetable.initialStopPlace = stopOfFirst.eva;
    } catch {
      // failed to fetch initialStopPlace we ignore that in that case
    }
  }
  async start(): Promise<AbfahrtenResult> {
    await this.getTimetables();
    await this.getRealtime();

    const timetables: any[] = Object.values(this.timetable);

    const filtered = timetables.filter(
      (t) => !this.realtimeIds.includes(t.rawId),
    );

    for (const t of filtered) {
      t.messages = {
        qos: [],
        delay: [],
        him: [],
      };
      // t.platform = t.scheduledPlatform;
    }

    const wings: { [key: string]: any } = {};

    const departures = [] as any[];
    const lookbehind = [] as any[];

    const computePromises = uniqBy(timetables, 'rawId').map(async (a: any) => {
      const referenceWingId = this.wingIds.get(a.mediumId);

      if (referenceWingId) {
        const referenceTrain = this.timetable[referenceWingId];

        if (
          referenceTrain &&
          (referenceTrain.arrival?.scheduledTime.getTime() ===
            a.arrival?.scheduledTime.getTime() ||
            referenceTrain.departure?.scheduledTime.getTime() ===
              a.departure?.scheduledTime.getTime())
        ) {
          wings[a.mediumId] = a;
          return this.computeExtra(a);
        }
      }

      const scheduledArrvial = a.arrival && a.arrival.scheduledTime;
      const arrival = a.arrival && a.arrival.time;
      const scheduledDeparture = a.departure && a.departure.scheduledTime;
      const departure = a.departure && a.departure.time;
      const time: Date =
        a.departure && a.departure.cancelled
          ? scheduledArrvial || scheduledDeparture
          : scheduledDeparture || scheduledArrvial;

      const realTime =
        a.departure && a.departure.cancelled
          ? arrival || departure
          : departure || arrival;

      if (isAfter(realTime, this.minDate) && isBefore(time, this.maxDate)) {
        if (isBefore(realTime, this.currentDate)) {
          lookbehind.push(a);
        } else {
          departures.push(a);
        }
      }
      return this.computeExtra(a);
    });

    await Promise.all(computePromises);

    return {
      departures,
      lookbehind,
      wings,
      stopPlaces: [this.evaNumber],
    };
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
  async parseHafasMessage(mNode: xmljs.Element, _trainNumber: string) {
    const id = getAttr(mNode, 'id');

    if (!id) return undefined;

    const himMessage = await getSingleHimMessageOfToday(id.slice(1));

    if (!himMessage) return undefined;
    // Sadly this is not accurate. Often affected Products is not corectly set
    // if (!himMessage.affectedProducts.some((p) => p.name.endsWith(trainNumber)))
    //   return undefined;
    const now = new Date();

    if (
      isBefore(now, himMessage.startTime) ||
      isAfter(now, himMessage.endTime)
    ) {
      return undefined;
    }

    const message = {
      timestamp: getTsOfNode(mNode),
      priority: getAttr(mNode, 'pr'),
      head: himMessage.head,
      text: himMessage.text,
      stopPlace:
        himMessage.fromStopPlace && !himMessage.toStopPlace
          ? himMessage.fromStopPlace
          : undefined,
      raw: process.env.NODE_ENV !== 'production' ? himMessage : undefined,
    };

    return {
      type: 'him',
      value: id,
      message,
    };
  }
  async parseMessage(mNode: xmljs.Element, trainNumber: string) {
    const value = getNumberAttr(mNode, 'c');
    const indexType = getAttr(mNode, 't');

    if (!indexType) return undefined;
    if (indexType === 'h') return this.parseHafasMessage(mNode, trainNumber);
    const type: undefined | string =
      messageTypeLookup[indexType as keyof typeof messageTypeLookup];

    if (
      !type ||
      !value ||
      value <= 1 ||
      ignoredMessageNumbers.includes(value)
    ) {
      return undefined;
    }

    // @ts-expect-error ???
    const lookedUpMessage = messages[value];

    // Freitext, nicht auflösbar
    if (!lookedUpMessage && indexType === 'f') {
      return undefined;
    }

    const message: IrisMessage = {
      superseded: undefined,
      text: lookedUpMessage || `${value} (?)`,
      timestamp: getTsOfNode(mNode)!,
      priority: getAttr(mNode, 'pr'),
      value,
    };

    return {
      type,
      value,
      message,
    };
  }
  async parseRealtimeS(sNode: xmljs.Element) {
    const rawId = getAttr(sNode, 'id');

    if (!rawId) return;
    const { id, mediumId, initialDeparture } = parseRawId(rawId);
    const tl = sNode.get('tl');
    const ref = sNode.get<Element>('ref/tl');

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

    const ar = sNode.get<Element>('ar');
    const dp = sNode.get<Element>('dp');
    const mArr: xmljs.Element[] = sNode.find(`${sNode.path()}//m`);

    if (!mArr) return;
    const messages: {
      [key: string]: {
        [key: string]: any;
      };
    } = {
      delay: {},
      qos: {},
      him: {},
    };

    const parsedMessages = await Promise.all(
      mArr.map((m) => this.parseMessage(m, this.timetable[rawId].train.number)),
    );

    for (const { type, message, value } of parsedMessages
      .filter(Boolean)
      .sort((a, b) =>
        compareAsc(a.message.timestamp || 0, b.message.timestamp || 0),
      )) {
      // @ts-expect-error This ´works...
      const supersedes: undefined | number[] = supersededMessages[value];

      if (!messages[type]) messages[type] = {};
      if (supersedes) {
        for (const v of supersedes) {
          if (messages[type][v]) {
            messages[type][v].superseded = true;
          }
        }
      }
      messages[type][value] = message;
    }

    return {
      id,
      mediumId,
      rawId,
      initialDeparture,
      // eslint-disable-next-line unicorn/no-array-reduce
      messages: Object.keys(messages).reduce((agg, messageKey) => {
        const messageValues = Object.values(messages[messageKey]);

        agg[messageKey] = messageValues.sort((a, b) =>
          compareDesc(a.timestamp, b.timestamp),
        );

        return agg;
      }, {} as Messages),
      arrival: parseRealtimeAr(ar),
      departure: parseRealtimeDp(dp),
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
        ar.plannedRoutePre || timetable.routePre.map((r: any) => r.name),
      );

      timetable.routePre = diff.flatMap((d) =>
        d.value.map((v) => ({
          name: v,
          additional: d.removed,
          cancelled: d.added,
        })),
      );
    }
    timetable.arrival.platform =
      ar.platform || timetable.arrival.scheduledPlatform;
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
        dp.plannedRoutePost || timetable.routePost.map((r: any) => r.name),
        dp.routePost,
      );

      timetable.routePost = diff.flatMap((d) =>
        d.value.map((v) => ({
          name: v,
          additional: d.added,
          cancelled: d.removed,
        })),
      );
    } else if (timetable.departure.cancelled && timetable.routePost) {
      for (const r of timetable.routePost) {
        r.cancelled = true;
      }
    }
    timetable.departure.platform =
      dp.platform || timetable.departure.scheduledPlatform;
  }
  async fetchRealtime() {
    const url = `/fchg/${this.evaNumber}`;

    const result = await irisGetRequest<string>(url);

    if (result.includes('<soapenv:Reason')) {
      throw result;
    }

    return result;
  }
  async getRealtime() {
    const rawXml = await this.fetchRealtime();
    const realtimeXml = xmljs.parseXml(rawXml);
    const sArr = realtimeXml.find<Element>('/timetable/s');

    if (!sArr) return;

    await Promise.allSettled(
      sArr.map(async (s) => {
        const realtime = await this.parseRealtimeS(s);

        if (!realtime) return;
        const timetable = this.timetable[realtime.rawId];

        if (!timetable) return;
        this.realtimeIds.push(realtime.rawId);
        this.addArrivalInfo(timetable, realtime.arrival);
        this.addDepartureInfo(timetable, realtime.departure);
        timetable.messages = realtime.messages;
        timetable.ref = realtime.ref;
      }),
    );
  }
  getWings(
    node: null | xmljs.Element,
    displayAsWing: boolean,
    referenceTrainRawId: string,
  ) {
    const wingAttr = getAttr(node, 'wings');

    if (!wingAttr) return;
    const rawWings = wingAttr.split('|');

    const mediumWings = rawWings.map<string>((w) => parseRawId(w).mediumId);

    if (displayAsWing) {
      for (const i of mediumWings) this.wingIds.set(i, referenceTrainRawId);
    }

    return mediumWings;
  }
  parseTimetableS(sNode: xmljs.Element) {
    const rawId = getAttr(sNode, 'id');

    if (!rawId) {
      return undefined;
    }
    const { id, mediumId, initialDeparture } = parseRawId(rawId);
    const tl = sNode.get<Element>('tl');

    if (!tl) {
      return undefined;
    }
    const ar = sNode.get<Element>('ar');
    const dp = sNode.get<Element>('dp');

    const scheduledArrival = parseTs(getAttr(ar, 'pt'));
    const scheduledDeparture = parseTs(getAttr(dp, 'pt'));
    const { trainNumber, trainCategory, t, o, productClass } = parseTl(tl);
    const timetableLineNumber = getAttr(dp || ar, 'l');
    const customLineNumber = getLineFromNumber(trainNumber);
    const fullTrainText = `${trainCategory} ${
      timetableLineNumber || trainNumber
    }`;

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
        wingIds: this.getWings(ar, false, rawId),
        platform: getAttr(ar, 'pp'),
        scheduledPlatform: getAttr(ar, 'pp'),
        hidden: Boolean(getAttr(ar, 'hi')),
      },
      departure: scheduledDeparture && {
        scheduledTime: scheduledDeparture,
        time: scheduledDeparture,
        wingIds: this.getWings(dp, true, rawId),
        platform: getAttr(dp, 'pp'),
        scheduledPlatform: getAttr(dp, 'pp'),
        hidden: Boolean(getAttr(dp, 'hi')),
      },
      productClass,
      // classes: getAttr(tl, 'f'),
      currentStopPlace: {
        name: this.currentStopPlaceName,
        evaNumber: this.evaNumber,
      },
      scheduledDestination:
        routePost[routePost.length - 1] || this.currentStopPlaceName,
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
        name: fullTrainText,
        number: trainNumber,
        line: timetableLineNumber || customLineNumber,
        type: trainCategory,
      },
      additional: undefined as undefined | boolean,
    };
  }
  getTimetable(rawXml: string) {
    const timetableXml = xmljs.parseXml(rawXml);

    const sArr = timetableXml.find<Element>('/timetable/s');

    const timetables: { [key: string]: any } = {};

    if (sArr) {
      for (const s of sArr) {
        const departure = this.parseTimetableS(s);

        if (!departure) continue;
        timetables[departure.rawId] = departure;
      }
    }

    return timetables;
  }
  getTimetables() {
    return Promise.all(
      this.segments.map(async (date) => {
        const key = `/plan/${this.evaNumber}/${format(date, 'yyMMdd/HH')}`;
        const cached = await timetableCache.get(key);
        if (cached) {
          this.timetable = {
            ...this.timetable,
            ...cached,
          };
          return;
        }

        try {
          const rawXml = await irisGetRequest<string>(key);
          const newDepartures = this.getTimetable(rawXml);

          this.timetable = {
            ...this.timetable,
            ...this.getTimetable(rawXml),
          };

          void timetableCache.set(key, newDepartures);
        } catch (error) {
          this.errors.push(error);
        }
      }),
    );
  }
}
