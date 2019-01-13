// @flow
/* eslint no-continue: 0 */
/*
 ** This algorithm is heavily inspired by https://github.com/derf/Travel-Status-DE-IRIS
 ** derf did awesome work reverse engineering the XML stuff!
 */
import { compareAsc, compareDesc, format } from 'date-fns';
import { diffArrays } from 'diff';
import { findLast, flatten, last } from 'lodash';
import { irisBase } from './index';
import { parseFromTimeZone } from 'date-fns-timezone';
import axios from 'axios';
import messageLookup, { messageTypeLookup, supersededMessages } from './messageLookup';
import NodeCache from 'node-cache';
import xmljs from 'libxmljs';
import type { Message } from 'types/abfahrten';

// 6 Hours in seconds
const stdTTL = 6 * 60 * 60;
const timetableCache: NodeCache<string, Object> = new NodeCache({ stdTTL });

type Route = {
  name: string,
  isCancelled?: boolean,
  isAdditional?: boolean,
};

const routeMap: string => Route = name => ({ name });
const normalizeRouteName: string => string = name =>
  name
    .replace('(', ' (')
    .replace(')', ') ')
    .trim();

function getAttr(node, name) {
  // $FlowFixMe
  return node?.attr(name)?.value();
}

function parseTs(ts) {
  if (ts) {
    return parseFromTimeZone(ts, 'YYMMDDHHmm', { timeZone: 'Europe/Berlin' });
  }
}

export function parseDp(dp: any) {
  if (!dp) return undefined;

  const routePost = getAttr(dp, 'cpth');

  return {
    departureTs: getAttr(dp, 'ct'),
    scheduledDepartureTs: getAttr(dp, 'pt'),
    platform: getAttr(dp, 'cp'),
    routePost: routePost ? routePost.split('|').map(normalizeRouteName) : undefined,
    // plannedRoutePost: getAttr(dp, 'ppth')?.split('|'),
    status: getAttr(dp, 'cs'),
  };
}

export function parseAr(ar: any) {
  if (!ar) return undefined;

  const routePre = getAttr(ar, 'cpth');

  return {
    arrivalTs: getAttr(ar, 'ct'),
    scheduledArrivalTs: getAttr(ar, 'pt'),
    platform: getAttr(ar, 'cp'),
    routePre: routePre ? routePre.split('|').map(normalizeRouteName) : undefined,
    // plannedRoutePre: getAttr(ar, 'ppth')?.split('|'),
    status: getAttr(ar, 'cs'),
    // statusSince: getAttr(ar, 'clt'),
  };
}

const trainRegex = /(\w+?)?? ?(RS|STB|IRE|RE|RB|IC|ICE|EC|ECE|TGV|NJ|RJ|S)? ?(\d+\w*)/;

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

const longDistanceRegex = /(ICE?|TGV|ECE?|RJ).*/;

export default class Timetable {
  timetable: Object = {};
  realtimeIds: string[] = [];
  evaId: string;
  segments: Date[];
  currentStation: string;

  constructor(evaId: string, segments: Date[], currentStation: string) {
    this.evaId = evaId;
    this.segments = segments;
    this.currentStation = normalizeRouteName(currentStation);
  }
  computeExtra(timetable: any) {
    timetable.isCancelled = timetable.arrivalIsCancelled || timetable.departureIsCancelled;
    const addInfo =
      timetable.routePre.some(r => r.isCancelled || r.isAdditional) ||
      timetable.routePost.some(r => r.isCancelled || r.isAdditional);

    timetable.route = [
      ...timetable.routePre,
      { name: timetable.currentStation, isCancelled: addInfo && timetable.isCancelled },
      ...timetable.routePost,
    ];
    timetable.destination = findLast(timetable.route, r => !r.isCancelled)?.name || timetable.scheduledDestination;
    timetable.via = this.getVia(timetable);

    delete timetable.routePre;
    delete timetable.routePost;
    delete timetable.arrivalIsCancelled;
    delete timetable.arrivalIsAdditional;
    delete timetable.departureIsCancelled;
    delete timetable.departureIsAdditional;
  }
  async start() {
    await this.getTimetables();
    await this.getRealtime();

    const timetables: any[] = Object.values(this.timetable);

    timetables
      .filter(t => !this.realtimeIds.includes(t.id))
      .forEach(t => {
        t.messages = {
          qos: [],
          delay: [],
        };
        t.platform = t.scheduledPlatform;
      });

    timetables.forEach(t => this.computeExtra(t));

    return timetables;
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
  parseMessage(mNode: any) {
    const value = getAttr(mNode, 'c');
    const type = messageTypeLookup[getAttr(mNode, 't')];

    if (!type || (value && value <= 1)) {
      return undefined;
    }

    return [
      type,
      {
        text: messageLookup[value] || `${value} (?)`,
        timestamp: parseTs(getAttr(mNode, 'ts')),
      },
      value,
    ];
  }
  parseRealtimeS(sNode: any): any {
    const rawId = getAttr(sNode, 'id');
    const id = rawId.match(/-?(\w+)/)[1] || rawId;
    const tl = sNode.get('tl');

    if (!this.timetable[id] && tl) {
      this.timetable[id] = this.parseTimetableS(sNode);
    }

    if (!this.timetable[id]) {
      return;
    }

    const ar = sNode.get('ar');
    const dp = sNode.get('dp');
    const mArr = sNode.find(`${sNode.path()}//m`);
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
      .sort((a, b) => compareAsc(a[1].timestamp, b[1].timestamp))
      .forEach(([messageType, message, value]) => {
        const supersedes = supersededMessages[value];

        if (supersedes) {
          message.superseeds = true;
          supersedes.forEach(v => {
            if (messages[messageType][v]) {
              messages[messageType][v].superseded = true;
            }
          });
        }
        messages[messageType][value] = message;
      });

    const delay: Message[] = (Object.values(messages.delay): any);
    const qos: Message[] = (Object.values(messages.qos): any);

    return {
      id,
      messages: {
        delay: delay.sort((a, b) => compareDesc(a.timestamp, b.timestamp)),
        qos: qos.sort((a, b) => compareDesc(a.timestamp, b.timestamp)),
      },
      arrival: parseAr(ar),
      departure: parseDp(dp),
    };
  }
  addArrivalInfo(timetable: any, ar: any) {
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
  addDepartureInfo(timetable: any, dp: any) {
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
            isCancelled: d.removed,
          }))
        )
      );
    }
    timetable.platform = dp.platform || timetable.scheduledPlatform;
  }
  async getRealtime() {
    const rawXml = await axios.get(`${irisBase}/fchg/${this.evaId}`).then(x => x.data);
    const realtimeXml = xmljs.parseXml(rawXml);
    const sArr = realtimeXml.find('/timetable/s');

    sArr.forEach(s => {
      const realtime = this.parseRealtimeS(s);

      if (!realtime) return;
      const timetable = this.timetable[realtime.id];

      if (!timetable) return;
      this.realtimeIds.push(realtime.id);
      this.addArrivalInfo(timetable, realtime.arrival);
      this.addDepartureInfo(timetable, realtime.departure);
      timetable.messages = realtime.messages;
    });
  }
  parseTimetableS(sNode: any) {
    const rawId = getAttr(sNode, 'id');
    const id = rawId.match(/-?(\w+)/)[1] || rawId;
    const tl = sNode.get('tl');

    if (!tl) {
      return undefined;
    }
    const ar = sNode.get('ar');
    const dp = sNode.get('dp');

    const scheduledArrival = parseTs(getAttr(ar, 'pt'));
    const scheduledDeparture = parseTs(getAttr(dp, 'pt'));
    const lineNumber = getAttr(dp || ar, 'l');
    const trainNumber = getAttr(tl, 'n');
    const trainType = getAttr(tl, 'c');
    const train = `${trainType} ${lineNumber || trainNumber}`;
    // $FlowFixMe
    const routePost: string[] = (getAttr(dp, 'ppth')?.split('|') || []).map(normalizeRouteName);
    // $FlowFixMe
    const routePre: string[] = (getAttr(ar, 'ppth')?.split('|') || []).map(normalizeRouteName);

    return {
      arrival: scheduledArrival,
      // arrivalWingIds: getAttr(ar, 'wings')?.split('|') || [],
      // classes: getAttr(tl, 'f'),
      currentStation: this.currentStation,
      // departureWingIds: getAttr(dp, 'wings')?.split('|') || [],
      departure: scheduledDeparture,
      scheduledDestination: last(routePost) || this.currentStation,
      lineNumber,
      platform: getAttr(dp, 'pp') || getAttr(ar, 'pp'),
      id,
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
      longDistance: longDistanceRegex.test(train),
      ...splitTrainType(train),
    };
  }
  getTimetable(rawXml: string) {
    const timetableXml = xmljs.parseXml(rawXml);

    const sArr = timetableXml.find('/timetable/s');

    const timetables = {};

    sArr.forEach(s => {
      const departure = this.parseTimetableS(s);

      if (!departure) return;
      timetables[departure.id] = departure;
    });

    return timetables;
  }
  getTimetables() {
    return Promise.all(
      this.segments.map(async date => {
        const key = `/plan/${this.evaId}/${format(date, 'yyMMdd/HH')}`;
        let result = timetableCache.get(key);

        if (!result) {
          const rawXml = await axios.get(`${irisBase}${key}`).then(x => x.data);

          result = this.getTimetable(rawXml);
        }

        this.timetable = {
          ...this.timetable,
          ...result,
        };
      })
    );
  }
}
