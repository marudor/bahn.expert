// @flow
import { Axios } from 'axios';
import { compareAsc } from 'date-fns';
import { getStation } from './station';
import Timetable, { type Result } from './Timetable';

export const noncdAxios = new Axios({
  baseURL: 'http://iris.noncd.db.de/iris-tts/timetable',
});
export const openDataAxios = new Axios({
  baseURL: 'https://api.deutschebahn.com/timetables/v1',
  headers: {
    Authorization: `Bearer ${process.env.TIMETABLES_OPEN_DATA_KEY || ''}`,
  },
});

type AbfahrtenOptions = {
  lookahead?: number,
  lookbehind?: number,
};
const defaultOptions = {
  lookahead: 150,
  lookbehind: 20,
};

const baseResult: Result = { departures: [], wings: {}, lageplan: undefined };

export function reduceResults(agg: Result, r: Result): Result {
  return {
    departures: [...agg.departures, ...r.departures],
    wings: {
      ...agg.wings,
      ...r.wings,
    },
    // eslint-disable-next-line no-nested-ternary
    lageplan: r.lageplan ? r.lageplan : agg.lageplan !== undefined ? agg.lageplan : r.lageplan,
  };
}

export async function getAbfahrten(
  evaId: string,
  withRelated: boolean = true,
  options: AbfahrtenOptions = {},
  axios: Axios = noncdAxios
): Promise<Result> {
  const lookahead = options.lookahead || defaultOptions.lookahead;
  const lookbehind = options.lookbehind || defaultOptions.lookbehind;

  const { station, relatedStations } = await getStation(evaId, 1, axios);
  let relatedAbfahrten = Promise.resolve(baseResult);

  if (withRelated) {
    relatedAbfahrten = Promise.all(relatedStations.map(s => getAbfahrten(s.eva, false, options, axios))).then(r =>
      r.reduce(reduceResults, baseResult)
    );
  }

  const timetable = new Timetable(
    evaId,
    station.name,
    {
      lookahead,
      lookbehind,
    },
    axios
  );
  const result = (await Promise.all([timetable.start(), relatedAbfahrten])).reduce(reduceResults, baseResult);

  result.departures.sort((a, b) => {
    const timeA =
      a.departureIsCancelled && !a.isCancelled ? a.scheduledArrival : a.scheduledDeparture || a.scheduledArrival;
    const timeB =
      b.departureIsCancelled && !b.isCancelled ? b.scheduledArrival : b.scheduledDeparture || b.scheduledArrival;
    // $FlowFixMe - either arrival or departure always exists
    const sort = compareAsc(timeA, timeB);

    if (!sort) {
      const splittedA = a.rawId.split('-');
      const splittedB = b.rawId.split('-');

      return splittedA[splittedA.length - 2] > splittedB[splittedB.length - 2] ? 1 : -1;
    }

    return sort;
  });

  return result;
}
