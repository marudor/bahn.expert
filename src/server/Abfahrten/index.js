// @flow
import { addHours, addMinutes, compareAsc, isAfter, isBefore, subHours } from 'date-fns';
import { flatten, uniqBy } from 'lodash';
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

export async function getAbfahrten(evaId: string, withRelated: boolean = true, options: AbfahrtenOptions = {}) {
  const lookahead = options.lookahead || defaultOptions.lookahead;
  const lookbehind = options.lookbehind || defaultOptions.lookbehind;

  const { station, relatedStations } = await getStation(evaId, 1);
  let relatedAbfahrten = Promise.resolve([]);

  if (withRelated) {
    relatedAbfahrten = Promise.all(relatedStations.map(s => getAbfahrten(s.eva, false, options))).then(a => flatten(a));
  }
  const date = new Date();
  const maxDate = addMinutes(date, lookahead);
  const segments = [date];

  for (let i = 1; i <= Math.ceil(lookahead / 60); i += 1) {
    segments.push(addHours(date, i));
  }
  for (let i = 1; i <= Math.ceil(lookbehind / 60); i += 1) {
    segments.push(subHours(date, i));
  }

  const timetable = new Timetable(evaId, segments, station.name);
  const abfahrten = flatten(await Promise.all([timetable.start(), relatedAbfahrten]));
  const filtered = uniqBy(abfahrten, 'rawId').filter(a => {
    const time = a.departure || a.arrival;

    return (
      isAfter(time, date) && (isBefore(time, maxDate) || isBefore(a.scheduledDeparture || a.scheduledArrival, maxDate))
    );
  });

  const sorted: any = filtered.sort((a, b) => {
    const sort = compareAsc(a.scheduledDeparture || a.scheduledArrival, b.scheduledDeparture || b.scheduledArrival);

    if (!sort) {
      return a.id > b.id ? 1 : -1;
    }

    return sort;
  });

  return sorted;
}
