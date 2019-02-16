// @flow
import { compareAsc } from 'date-fns';
import { getCachedLageplan, getLageplan } from '../Bahnhof/Lageplan';
import { getStation } from './station';
import Timetable, { type Result } from './Timetable';

// @flow
export const irisBase = 'http://iris.noncd.db.de/iris-tts/timetable';

type AbfahrtenOptions = {
  lookahead?: number,
  lookbehind?: number,
};
const defaultOptions = {
  lookahead: 150,
  lookbehind: 20,
};

const baseResult: Result = { departures: [], wings: {}, lageplan: undefined };

function reduceResults(agg: Result, r: Result) {
  return {
    departures: [...agg.departures, ...r.departures],
    wings: {
      ...agg.wings,
      ...r.wings,
    },
    lageplan: agg.lageplan || r.lageplan,
  };
}

export async function getAbfahrten(evaId: string, withRelated: boolean = true, options: AbfahrtenOptions = {}) {
  const lookahead = options.lookahead || defaultOptions.lookahead;
  const lookbehind = options.lookbehind || defaultOptions.lookbehind;

  const { station, relatedStations } = await getStation(evaId, 1);
  let relatedAbfahrten = Promise.resolve(baseResult);

  if (withRelated) {
    relatedAbfahrten = Promise.all(relatedStations.map(s => getAbfahrten(s.eva, false, options))).then(r =>
      r.reduce(reduceResults, baseResult)
    );
  }

  const timetable = new Timetable(evaId, station.name, {
    lookahead,
    lookbehind,
  });
  const result: Result = (await Promise.all([timetable.start(), relatedAbfahrten])).reduce(reduceResults, baseResult);

  result.departures.sort((a, b) => {
    const sort = compareAsc(a.scheduledDeparture || a.scheduledArrival, b.scheduledDeparture || b.scheduledArrival);

    if (!sort) {
      const splittedA = a.rawId.split('-');
      const splittedB = b.rawId.split('-');

      return splittedA[splittedA.length - 2] > splittedB[splittedB.length - 2] ? 1 : -1;
    }

    return sort;
  });

  result.lageplan = getCachedLageplan(station.name);
  if (result.lageplan === undefined) {
    getLageplan(station.name);
  }

  return result;
}
