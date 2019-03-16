// @flow
/* eslint no-continue: 0 */
/*
 ** This algorithm is heavily inspired by https://github.com/derf/Travel-Status-DE-IRIS
 ** derf did awesome work reverse engineering the XML stuff!
 */
import { addHours, addMinutes, compareAsc, compareDesc, format, isAfter, isBefore, subHours } from 'date-fns';
import { diffArrays } from 'diff';
import { findLast, flatten, last, uniqBy } from 'lodash';
import { getAttr, getNumberAttr, parseTs } from './helper';
import { getCachedLageplan, getLageplan } from '../Bahnhof/Lageplan';
import { irisBase } from './index';
import axios from 'axios';
import messageLookup, { messageTypeLookup, supersededMessages } from './messageLookup';
import NodeCache from 'node-cache';
import xmljs, { type XmlNode } from 'libxmljs';
import type { Message } from 'types/abfahrten';

export type Result = {
  departures: any[],
  wings: Object,
  lageplan?: ?string,
};

type ArDp = {|
  platform: ?string,
  status: ?string,
|};
type ParsedDp = {|
  ...ArDp,
  departureTs: ?string,
  scheduledDepartureTs: ?string,
  routePost: ?(string[]),
|};

type ParsedAr = {|
  ...ArDp,
  arrivalTs: ?string,
  scheduledArrivalTs: ?string,
  routePre: ?(string[]),
|};

// 6 Hours in seconds
const stdTTL = 6 * 60 * 60;
const timetableCache: NodeCache<string, Object> = new NodeCache({ stdTTL });

type Route = {
  name: string,
  isCancelled?: boolean,
  isAdditional?: boolean,
};

export type TimetableOptions = {
  lookahead: number,
  lookbehind: number,
};

const routeMap: string => Route = name => ({ name });
const normalizeRouteName = (name: string) =>
  name
    .replace('(', ' (')
    .replace(')', ') ')
    .trim();

export function parseDp(dp: ?XmlNode): ?ParsedDp {
  if (!dp) return undefined;

  const routePost = getAttr(dp, 'cpth');

  return {
    departureTs: getAttr(dp, 'ct'),
    scheduledDepartureTs: getAttr(dp, 'pt'),
    platform: getAttr(dp, 'cp'),
    routePost: routePost ? routePost.split('|').map<string>(normalizeRouteName) : undefined,
    // plannedRoutePost: getAttr(dp, 'ppth')?.split('|'),
    status: getAttr(dp, 'cs'),
  };
}

export function parseAr(ar: ?XmlNode): ?ParsedAr {
  if (!ar) return undefined;

  const routePre = getAttr(ar, 'cpth');

  return {
    arrivalTs: getAttr(ar, 'ct'),
    scheduledArrivalTs: getAttr(ar, 'pt'),
    platform: getAttr(ar, 'cp'),
    routePre: routePre ? routePre.split('|').map<string>(normalizeRouteName) : undefined,
    // plannedRoutePre: getAttr(ar, 'ppth')?.split('|'),
    status: getAttr(ar, 'cs'),
    // statusSince: getAttr(ar, 'clt'),
  };
}

const trainRegex = /(\w+?)?? ?(RS|IRE|RE|RB|IC|ICE|EC|ECE|TGV|NJ|RJ|S)? ?(\d+\w*)/;

function getTrainType(thirdParty, trainType) {
  if ((thirdParty === 'NWB' && trainType === 'RS') || thirdParty === 'BSB') {
    return 'S';
  }
  if (thirdParty === 'FLX') {
    return 'IR';
  }
  if (thirdParty) {
    return 'RB';
  }
  if (trainType === 'ECE') {
    return 'EC';
  }

  return trainType;
}

function getTrainId(thirdParty, rawTrainType, trainId) {
  if (thirdParty === 'NWB' && rawTrainType === 'RS') {
    return `${rawTrainType}${trainId}`;
  }

  return trainId || undefined;
}

export function splitTrainType(train: string = '') {
  const parsed = trainRegex.exec(train);

  if (parsed) {
    const thirdParty = parsed[1] || undefined;
    const trainType = getTrainType(thirdParty, parsed[2]);

    return {
      thirdParty,
      trainType,
      trainId: getTrainId(thirdParty, parsed[2], parsed[3]),
    };
  }

  return {
    thirdParty: undefined,
    trainType: undefined,
    trainId: undefined,
  };
}

export function parseTl(tl: XmlNode) {
  return {
    f: getAttr(tl, 'f'),
    o: getAttr(tl, 'o'),
    t: getAttr(tl, 't'),
    trainNumber: getAttr(tl, 'n') || '',
    trainType: getAttr(tl, 'c') || '',
  };
}

const idRegex = /-?(\w+)/;
const mediumIdRegex = /-?(\w+-\w+)/;

function parseRawId(rawId: string) {
  return {
    id: rawId.match(idRegex)?.[1] || rawId,
    mediumId: rawId.match(mediumIdRegex)?.[1] || rawId,
  };
}

const longDistanceRegex = /(ICE?|TGV|ECE?|RJ).*/;

export default class Timetable {
  timetable: {
    [key: string]: any,
  } = {};
  realtimeIds: string[] = [];
  evaId: string;
  segments: Date[];
  currentStation: string;
  wingIds: Set<string> = new Set();
  currentDate: Date;
  maxDate: Date;

  constructor(evaId: string, currentStation: string, options: TimetableOptions) {
    this.evaId = evaId;
    this.currentDate = new Date();
    this.maxDate = addMinutes(this.currentDate, options.lookahead);
    this.segments = [this.currentDate];
    for (let i = 1; i <= Math.ceil(options.lookahead / 60); i += 1) {
      this.segments.push(addHours(this.currentDate, i));
    }
    for (let i = 1; i <= Math.ceil(options.lookbehind / 60); i += 1) {
      this.segments.push(subHours(this.currentDate, i));
    }
    this.currentStation = normalizeRouteName(currentStation);
  }
  computeExtra(timetable: any) {
    timetable.isCancelled =
      (timetable.arrivalIsCancelled && (timetable.departureIsCancelled || !timetable.scheduledDeparture)) ||
      (timetable.departureIsCancelled && !timetable.scheduledArrival);

    if (timetable.isCancelled) {
      const anyCancelled = timetable.routePre.some(r => r.isCancelled) || timetable.routePost.some(r => r.isCancelled);

      if (anyCancelled) {
        timetable.routePre.forEach(r => (r.isCancelled = true));
        timetable.routePost.forEach(r => (r.isCancelled = true));
      }
    }

    timetable.route = [
      ...timetable.routePre,
      { name: timetable.currentStation, isCancelled: timetable.isCancelled },
      ...timetable.routePost,
    ];
    timetable.destination = findLast(timetable.route, r => !r.isCancelled)?.name || timetable.scheduledDestination;
    timetable.via = this.getVia(timetable);
    // $FlowFixMe - optional chaining call
    const filteredRoutePost = timetable.routePost?.filter(r => !r.isCancelled);

    timetable.auslastung =
      !timetable.isCancelled && timetable.longDistance && !timetable.substitute && Boolean(filteredRoutePost?.length);
    timetable.reihung = !timetable.isCancelled && timetable.longDistance && Boolean(filteredRoutePost?.length);

    delete timetable.routePre;
    delete timetable.routePost;
    delete timetable.arrivalIsAdditional;
    delete timetable.departureIsAdditional;
  }
  async start(): Promise<Result> {
    const lageplan = getCachedLageplan(this.currentStation);

    if (lageplan === undefined) {
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
        t.platform = t.scheduledPlatform;
      });

    const wings = {};

    const filtered: any[] = uniqBy<any>(timetables, 'rawId').filter((a: any) => {
      const isWing = this.wingIds.has(a.mediumId);

      if (isWing) {
        wings[a.mediumId] = a;
        this.computeExtra(a);

        return false;
      }

      const time = a.departureIsCancelled ? a.arrival : a.departure || a.arrival;

      return (
        isAfter(time, this.currentDate) &&
        (isBefore(time, this.maxDate) || isBefore(a.scheduledDeparture || a.scheduledArrival, this.maxDate))
      );
    });

    filtered.forEach(t => this.computeExtra(t));

    return {
      departures: filtered,
      wings,
      lageplan,
    };
  }
  getVia(timetable: any, maxParts: number = 3): string[] {
    const via: string[] = [...timetable.routePost].filter(v => !v.isCancelled).map(r => r.name);

    via.pop();
    const important = via.filter(v => v.match(/(HB$|Hbf|Centraal|Flughafen)/));
    let viaShow: string[] = [];

    if (via.length <= maxParts) {
      viaShow = via;
    } else {
      if (important.length >= maxParts) {
        viaShow.push(via[0]);
      } else {
        viaShow = via.splice(0, maxParts - important.length);
      }

      while (viaShow.length < maxParts && important.length) {
        const stop = important.shift();

        if (!viaShow.includes(stop)) {
          viaShow.push(stop);
        }
      }
    }

    return viaShow.map(v => v.replace(' Hbf', ''));
  }
  parseRef(tl: XmlNode) {
    const { trainType, trainNumber } = parseTl(tl);
    const train = `${trainType} ${trainNumber}`;

    return {
      trainType,
      trainNumber,
      train,
    };
  }
  parseMessage(mNode: XmlNode) {
    const value = getNumberAttr(mNode, 'c');
    const indexType = getAttr(mNode, 't');

    if (!indexType) return undefined;
    const type: ?string = messageTypeLookup[indexType];

    if (!type || !value || value <= 1) {
      return undefined;
    }

    return {
      type,
      value,
      message: {
        superseeds: false,
        text: messageLookup[value] || `${value} (?)`,
        timestamp: parseTs(getAttr(mNode, 'ts')),
      },
    };
  }
  parseRealtimeS(sNode: XmlNode) {
    const rawId = getAttr(sNode, 'id');

    if (!rawId) return;
    const { id, mediumId } = parseRawId(rawId);
    const tl = sNode.get('tl');
    const ref = sNode.get('ref/tl');

    if (!this.timetable[rawId] && tl) {
      this.timetable[rawId] = this.parseTimetableS(sNode);
    }

    if (!this.timetable[rawId]) {
      return;
    }

    const ar = sNode.get('ar');
    const dp = sNode.get('dp');
    const mArr = sNode.find(`${sNode.path()}//m`);

    if (!mArr) return;
    const messages: {
      delay: {
        [key: string]: Message,
      },
      qos: {
        [key: string]: Message,
      },
    } = {
      delay: {},
      qos: {},
    };

    mArr
      .map(m => this.parseMessage(m))
      .filter(Boolean)
      // $FlowFixMe - undefined as timestamp is okay here
      .sort((a, b) => compareAsc(a.message.timestamp, b.message.timestamp))
      .forEach(({ type, message, value }) => {
        const supersedes = supersededMessages[value];

        if (supersedes) {
          message.superseeds = true;
          supersedes.forEach(v => {
            if (messages[type][v]) {
              messages[type][v].superseded = true;
            }
          });
        }
        messages[type][value] = message;
      });

    const delay: Message[] = (Object.values(messages.delay): any);
    const qos: Message[] = (Object.values(messages.qos): any);

    delay.sort((a, b) => compareDesc(a.timestamp, b.timestamp));
    qos.sort((a, b) => compareDesc(a.timestamp, b.timestamp));

    return {
      id,
      mediumId,
      rawId,
      messages: {
        delay,
        qos,
      },
      arrival: parseAr(ar),
      departure: parseDp(dp),
      ref: ref ? this.parseRef(ref) : undefined,
    };
  }
  addArrivalInfo(timetable: any, ar: ?ParsedAr) {
    timetable.delayArrival = 0;
    if (!ar) return;
    timetable.arrivalIsCancelled = ar.status === 'c';
    timetable.arrivalIsAdditional = ar.status === 'a';
    if (ar.scheduledArrivalTs) {
      timetable.scheduledArrival = parseTs(ar.scheduledArrivalTs);
      timetable.arrival = timetable.scheduledArrival;
    }
    if (ar.arrivalTs) {
      timetable.arrival = parseTs(ar.arrivalTs);
    }
    timetable.delayArrival = (timetable.arrival - timetable.scheduledArrival) / 60 / 1000;
    if (ar.routePre) {
      const diff = diffArrays(ar.routePre, timetable.routePre.map(r => r.name));

      timetable.routePre = flatten(
        diff.map(d =>
          d.value.map(v => ({
            name: v,
            isAdditional: d.removed,
            isCancelled: d.added,
          }))
        )
      );
    }
    timetable.platform = ar.platform || timetable.scheduledPlatform;
  }
  addDepartureInfo(timetable: any, dp: ?ParsedDp) {
    timetable.delayDeparture = 0;
    if (!dp) return;
    timetable.departureIsCancelled = dp.status === 'c';
    timetable.departureIsAdditional = dp.status === 'a';
    if (dp.scheduledDepartureTs) {
      timetable.scheduledDeparture = parseTs(dp.scheduledDepartureTs);
      timetable.departure = timetable.scheduledDeparture;
    }
    if (dp.departureTs) {
      timetable.departure = parseTs(dp.departureTs);
    }
    timetable.delayDeparture = (timetable.departure - timetable.scheduledDeparture) / 60 / 1000;
    if (dp.routePost) {
      const diff = diffArrays(timetable.routePost.map(r => r.name), dp.routePost);

      timetable.routePost = flatten(
        diff.map(d =>
          d.value.map(v => ({
            name: v,
            isAdditional: d.added,
            isCancelled: d.removed || timetable.departureIsCancelled,
          }))
        )
      );
    } else if (timetable.departureIsCancelled && timetable.routePost) {
      timetable.routePost.forEach(r => (r.isCancelled = true));
    }
    timetable.platform = dp.platform || timetable.scheduledPlatform;
  }
  async fetchRealtime() {
    const url = `${irisBase}/fchg/${this.evaId}`;

    if (process.env.NODE_ENV !== 'production') {
      const cached = timetableCache.get(url);

      if (cached) return cached;
    }
    const result = await axios.get(url).then(x => x.data);

    if (process.env.NODE_ENV !== 'production') {
      timetableCache.set(url, result);
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
  getWings(node: ?XmlNode, displayAsWing: boolean) {
    // $FlowFixMe - optional chaining call
    const rawWings: ?(string[]) = getAttr(node, 'wings')?.split('|');

    if (!rawWings) return undefined;

    const mediumWings = rawWings.map<string>(w => parseRawId(w).mediumId);

    if (displayAsWing) {
      mediumWings.forEach(i => this.wingIds.add(i));
    }

    return mediumWings;
  }
  parseTimetableS(sNode: XmlNode) {
    const rawId = getAttr(sNode, 'id');

    if (!rawId) {
      return undefined;
    }
    const { id, mediumId } = parseRawId(rawId);
    const tl = sNode.get('tl');

    if (!tl) {
      return undefined;
    }
    const ar = sNode.get('ar');
    const dp = sNode.get('dp');

    const scheduledArrival = parseTs(getAttr(ar, 'pt'));
    const scheduledDeparture = parseTs(getAttr(dp, 'pt'));
    const lineNumber = getAttr(dp || ar, 'l');
    const { trainNumber, trainType, t, o } = parseTl(tl);
    const train = `${trainType} ${lineNumber || trainNumber}`;
    // $FlowFixMe - optional chaining call
    const routePost: string[] = (getAttr(dp, 'ppth')?.split('|') || []).map(normalizeRouteName);
    // $FlowFixMe - optional chaining call
    const routePre: string[] = (getAttr(ar, 'ppth')?.split('|') || []).map(normalizeRouteName);

    return {
      o,
      arrival: scheduledArrival,
      arrivalWingIds: this.getWings(ar, false),
      // classes: getAttr(tl, 'f'),
      currentStation: this.currentStation,
      currentStationEva: this.evaId,
      departureWingIds: this.getWings(dp, true),
      departure: scheduledDeparture,
      scheduledDestination: last(routePost) || this.currentStation,
      lineNumber,
      platform: getAttr(dp, 'pp') || getAttr(ar, 'pp'),
      id,
      rawId,
      mediumId,
      // routeEnd: getAttr(dp, 'pde'),
      routePost: routePost.map<Route>(routeMap),
      routePre: routePre.map<Route>(routeMap),
      // routeStart: getAttr(ar, 'pde'),
      scheduledArrival,
      scheduledDeparture,
      scheduledPlatform: getAttr(dp, 'pp') || getAttr(ar, 'pp'),
      trainNumber,
      // transfer: getAttr(dp || ar, 'tra'),
      train,
      substitute: t === 'e',
      longDistance: longDistanceRegex.test(train),
      ...splitTrainType(train),
    };
  }
  getTimetable(rawXml: string) {
    const timetableXml = xmljs.parseXml(rawXml);

    const sArr = timetableXml.find('/timetable/s');

    const timetables = {};

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
        let rawXml = timetableCache.get(key);

        if (!rawXml) {
          rawXml = await axios.get(`${irisBase}${key}`).then(x => x.data);

          timetableCache.set(key, rawXml);
        }

        this.timetable = {
          ...this.timetable,
          ...this.getTimetable(rawXml),
        };
      })
    );
  }
}
