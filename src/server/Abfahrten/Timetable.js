// @flow
/* eslint no-continue: 0 */
import { de } from 'date-fns/locale';
import { diffArrays } from 'diff';
import { flatten, last } from 'lodash';
import { format, parse } from 'date-fns';
import { irisBase } from './index';
import axios from 'axios';
import messageLookup, { messageTypeLookup, supersededMessages } from './messageLookup';
import xmljs from 'libxmljs';

const locale = { locale: de };

type Route = {
  name: string,
  isCancelled?: boolean,
  isAdditional?: boolean,
};

const routeMap: string => Route = name => ({ name });

function getAttr(node, name) {
  // $FlowFixMe
  return node?.attr(name)?.value();
}

function parseTs(ts) {
  if (ts) {
    return parse(ts, 'yyMMddHHmm', 0, locale);
  }
}

export function parseDp(dp: any) {
  if (!dp) return undefined;

  const routePost = getAttr(dp, 'cpth');

  return {
    departureTs: getAttr(dp, 'ct'),
    scheduledDepartureTs: getAttr(dp, 'pt'),
    platform: getAttr(dp, 'cp'),
    routePost: routePost ? routePost.split('|') : undefined,
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
    routePre: routePre ? routePre.split('|') : undefined,
    // plannedRoutePre: getAttr(ar, 'ppth')?.split('|'),
    status: getAttr(ar, 'cs'),
    // statusSince: getAttr(ar, 'clt'),
  };
}

export default class Timetable {
  timetable: Object = {};
  realtimeIds: string[] = [];
  evaId: string;
  segments: Date[];
  currentStation: string;

  constructor(evaId: string, segments: Date[], currentStation: string) {
    this.evaId = evaId;
    this.segments = segments;
    this.currentStation = currentStation;
  }
  computeExtra(timetable: any) {
    timetable.isCancelled = timetable.arrivalIsCancelled || timetable.departureIsCancelled;
    timetable.route = [
      ...timetable.routePre,
      { name: timetable.currentStation, isCancelled: timetable.isCancelled },
      ...timetable.routePost,
    ];
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

    if (value && value <= 1) {
      return [];
    }

    return [
      getAttr(mNode, 't'),
      {
        text: messageLookup[value],
        timestamp: parseTs(getAttr(mNode, 'ts')),
      },
      value,
    ];
  }
  parseRealtimeS(sNode: any): any {
    const id = getAttr(sNode, 'id');
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
    const messages = {
      delay: {},
      qos: {},
    };

    for (let i = mArr.length - 1; i >= 0; i -= 1) {
      const m = mArr[i];
      const [type, message, value] = this.parseMessage(m);

      if (!type) continue;
      const messageType = messageTypeLookup[type];

      if (!messageType) continue;
      const supersedes = supersededMessages[value];

      if (supersedes) {
        supersedes.forEach(v => {
          if (messages[messageType][v]) {
            messages[messageType][v].superseded = true;
          }
        });
      }
      messages[messageType][value] = message;
    }

    return {
      id,
      messages: {
        delay: Object.values(messages.delay),
        qos: Object.values(messages.qos),
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
    const id = getAttr(sNode, 'id');
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
    const routePost: string[] = getAttr(dp, 'ppth')?.split('|') || [];
    // $FlowFixMe
    const routePre: string[] = getAttr(ar, 'ppth')?.split('|') || [];

    return {
      arrival: scheduledArrival,
      // arrivalWingIds: getAttr(ar, 'wings')?.split('|') || [],
      // classes: getAttr(tl, 'f'),
      currentStation: this.currentStation,
      // departureWingIds: getAttr(dp, 'wings')?.split('|') || [],
      departure: scheduledDeparture,
      destination: last(routePost) || this.currentStation,
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
    };
  }
  getTimetable(rawXml: string) {
    const timetableXml = xmljs.parseXml(rawXml);

    const sArr = timetableXml.find('/timetable/s');

    sArr.forEach(s => {
      const departure = this.parseTimetableS(s);

      if (!departure) return;
      this.timetable[departure.id] = departure;
    });
  }
  getTimetables() {
    return Promise.all(
      this.segments.map(async date => {
        const rawXml = await axios.get(`${irisBase}/plan/${this.evaId}/${format(date, 'yyMMdd/HH')}`).then(x => x.data);

        return this.getTimetable(rawXml);
      })
    );
  }
}
