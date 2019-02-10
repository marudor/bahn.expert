// @flow
import { compareAsc } from 'date-fns';
import { getStation } from './station';
import Timetable from './Timetable';

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

type Result = {
  departures: any[],
  wings: Object,
};

const baseResult: Result = { departures: [], wings: {} };

function reduceResults(agg: Result, r: Result) {
  return {
    departures: [...agg.departures, ...r.departures],
    wings: {
      ...agg.wings,
      ...r.wings,
    },
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

  return result;
}
