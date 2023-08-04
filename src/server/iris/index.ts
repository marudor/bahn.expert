/* eslint-disable no-console */
import { compareAsc, parseISO } from 'date-fns';
import { getStation } from './station';
import { isStrikeMessage } from '@/server/iris/messageLookup';
import { Timetable } from './Timetable';
import type { Abfahrt, AbfahrtenResult } from '@/types/iris';

interface AbfahrtenOptions {
  lookahead: number;
  lookbehind: number;
  startTime?: Date;
}

const baseResult: AbfahrtenResult = {
  departures: [],
  lookbehind: [],
  wings: {},
  stopPlaces: [],
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
    stopPlaces: [...agg.stopPlaces, ...r.stopPlaces],
  };
}

export const timeByScheduled = (a: Abfahrt): string | Date | undefined => {
  const onlyDepartureCancelled =
    !a.cancelled && a.departure && a.departure.cancelled;
  const arrivalScheduledTime = a.arrival?.scheduledTime;
  const departureScheduledTime = a.departure?.scheduledTime;

  return onlyDepartureCancelled
    ? arrivalScheduledTime || departureScheduledTime
    : departureScheduledTime || arrivalScheduledTime;
};

export const timeByReal = (a: Abfahrt): string | Date | undefined => {
  const onlyDepartureCancelled =
    !a.cancelled && a.departure && a.departure.cancelled;
  const arrivalTime = a.arrival?.time;
  const departureTime = a.departure?.time;

  return onlyDepartureCancelled
    ? arrivalTime || departureTime
    : departureTime || arrivalTime;
};

export const sortAbfahrt =
  (timeFn: typeof timeByReal) =>
  (a: Abfahrt, b: Abfahrt): number => {
    const timeA = timeFn(a)!;
    const timeB = timeFn(b)!;
    const sort = compareAsc(
      typeof timeA === 'string' ? parseISO(timeA) : timeA,
      typeof timeB === 'string' ? parseISO(timeB) : timeB,
    );

    if (!sort) {
      const splittedA = a.rawId.split('-');
      const splittedB = b.rawId.split('-');

      return splittedA.at(-2)! > splittedB.at(-2)! ? 1 : -1;
    }

    return sort;
  };

function getRawIdsToRemove(
  departures: Abfahrt[],
  lookbehind: Abfahrt[],
): string[] {
  const groupedByMediumId = new Map<string, Abfahrt[]>();
  for (const a of [...lookbehind, ...departures]) {
    const currentList = groupedByMediumId.get(a.mediumId) || [];
    currentList.push(a);
    groupedByMediumId.set(a.mediumId, currentList);
  }
  const idsToRemove: string[] = [];

  for (const [, list] of groupedByMediumId) {
    if (list.length) {
      const cancelledInList = list.filter((a) => a.cancelled);
      if (cancelledInList.length !== list.length) {
        for (const cancelledAbfahrt of cancelledInList) {
          idsToRemove.push(cancelledAbfahrt.rawId);
        }
      }
    }
  }

  return idsToRemove;
}

export async function getAbfahrten(
  evaId: string,
  withRelated = true,
  options: AbfahrtenOptions,
  sloppy?: boolean,
  evaNumbers?: string[],
): Promise<AbfahrtenResult> {
  const lookahead = options.lookahead;
  const lookbehind = options.lookbehind;

  const { station, relatedStations } = await getStation(evaId);
  let relatedAbfahrten = Promise.resolve(baseResult);

  if (withRelated) {
    const filteredRelatedStations = evaNumbers
      ? relatedStations.filter((s) => evaNumbers.includes(s.eva))
      : relatedStations;
    relatedAbfahrten = Promise.all(
      filteredRelatedStations.map((s) => getAbfahrten(s.eva, false, options)),
      // eslint-disable-next-line unicorn/no-array-reduce
    ).then((r) => r.reduce(reduceResults, baseResult));
  }

  const timetable = new Timetable(evaId, station.name, {
    lookahead,
    lookbehind,
    startTime: options.startTime,
    sloppy,
  });
  const result = (await Promise.all([timetable.start(), relatedAbfahrten]))
    // eslint-disable-next-line unicorn/no-array-reduce
    .reduce(reduceResults, baseResult);

  if (sloppy) {
    return result;
  }

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
