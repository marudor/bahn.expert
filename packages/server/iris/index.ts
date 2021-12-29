import { compareAsc } from 'date-fns';
import { getStation } from './station';
import { isStrikeMessage } from 'server/iris/messageLookup';
import Timetable from './Timetable';
import type { Abfahrt, AbfahrtenResult } from 'types/iris';

interface AbfahrtenOptions {
  lookahead?: number;
  lookbehind?: number;
  currentDate?: Date;
}
const defaultOptions = {
  lookahead: 150,
  lookbehind: 0,
};

const baseResult: AbfahrtenResult = {
  departures: [],
  lookbehind: [],
  wings: {},
};

export function reduceResults(
  agg: AbfahrtenResult,
  r: AbfahrtenResult,
): AbfahrtenResult {
  return {
    departures: [...agg.departures, ...r.departures],
    lookbehind: [...agg.lookbehind, ...r.lookbehind],
    wings: {
      ...agg.wings,
      ...r.wings,
    },
  };
}

const timeByScheduled = (a: Abfahrt) => {
  const onlyDepartureCancelled =
    !a.cancelled && a.departure && a.departure.cancelled;
  const arrivalScheduledTime = a.arrival && a.arrival.scheduledTime;
  const departureScheduledTime = a.departure && a.departure.scheduledTime;

  return onlyDepartureCancelled
    ? arrivalScheduledTime || departureScheduledTime
    : departureScheduledTime || arrivalScheduledTime;
};

const timeByReal = (a: Abfahrt) => {
  const onlyDepartureCancelled =
    !a.cancelled && a.departure && a.departure.cancelled;
  const arrivalTime = a.arrival && a.arrival.time;
  const departureTime = a.departure && a.departure.time;

  return onlyDepartureCancelled
    ? arrivalTime || departureTime
    : departureTime || arrivalTime;
};

const sortAbfahrt = (timeFn: typeof timeByReal) => (a: Abfahrt, b: Abfahrt) => {
  const timeA = timeFn(a);
  const timeB = timeFn(b);
  // @ts-expect-error this works
  const sort = compareAsc(timeA, timeB);

  if (!sort) {
    const splittedA = a.rawId.split('-');
    const splittedB = b.rawId.split('-');

    return splittedA[splittedA.length - 2] > splittedB[splittedB.length - 2]
      ? 1
      : -1;
  }

  return sort;
};

function getRawIdsToRemove(
  departures: Abfahrt[],
  lookbehind: Abfahrt[],
): string[] {
  const groupedByMediumId = new Map<string, Abfahrt[]>();
  [...lookbehind, ...departures].forEach((a) => {
    const currentList = groupedByMediumId.get(a.mediumId) || [];
    currentList.push(a);
    groupedByMediumId.set(a.mediumId, currentList);
  });
  const idsToRemove: string[] = [];

  groupedByMediumId.forEach((list) => {
    if (list.length) {
      const cancelledInList = list.filter((a) => a.cancelled);
      if (cancelledInList.length !== list.length) {
        cancelledInList.forEach((cancelledAbfahrt) => {
          idsToRemove.push(cancelledAbfahrt.rawId);
        });
      }
    }
  });

  return idsToRemove;
}

export async function getAbfahrten(
  evaId: string,
  withRelated = true,
  options: AbfahrtenOptions = {},
): Promise<AbfahrtenResult> {
  const lookahead = options.lookahead || defaultOptions.lookahead;
  const lookbehind = options.lookbehind || defaultOptions.lookbehind;

  const { station, relatedStations } = await getStation(evaId, 1);
  let relatedAbfahrten = Promise.resolve(baseResult);

  if (withRelated) {
    relatedAbfahrten = Promise.all(
      relatedStations.map((s) => getAbfahrten(s.eva, false, options)),
    ).then((r) => r.reduce(reduceResults, baseResult));
  }

  const timetable = new Timetable(evaId, station.name, {
    lookahead,
    lookbehind,
    currentDate: options.currentDate,
  });
  const result = (
    await Promise.all([timetable.start(), relatedAbfahrten])
  ).reduce(reduceResults, baseResult);

  /**
   * We search if trains with the same mediumId exist. Should only happen if the same train departs or arrives at the same station (like Stuttgart Hbf and Stuttgart Hbf (tief))
   * If we find those we remove any cancelled. Unless all are cancelled If all are cancelled we keep all.
   */
  const rawIdsToRemove = getRawIdsToRemove(
    result.departures,
    result.lookbehind,
  );

  result.departures = result.departures.filter(
    (a) => !rawIdsToRemove.includes(a.rawId),
  );
  result.lookbehind = result.lookbehind.filter(
    (a) => !rawIdsToRemove.includes(a.rawId),
  );

  result.departures.sort(sortAbfahrt(timeByScheduled));
  result.lookbehind.sort(sortAbfahrt(timeByReal));

  const departureStrikes = result.departures.filter((d) =>
    Object.values(d.messages).flat().find(isStrikeMessage),
  ).length;

  const loobehindStrikes = result.lookbehind.filter((d) =>
    Object.values(d.messages).flat().find(isStrikeMessage),
  ).length;

  result.strike = departureStrikes + loobehindStrikes;

  return result;
}
