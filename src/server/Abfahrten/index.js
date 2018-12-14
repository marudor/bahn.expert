// @flow
import { addHours, addMinutes, compareAsc, isAfter, isBefore, subHours } from 'date-fns';
import { flatten, uniqBy } from 'lodash';
import { getStation } from './station';
import Timetable from './Timetable';

// @flow
import axios from 'axios';
import type { Abfahrt } from 'types/abfahrten';

export const irisBase = 'http://iris.noncd.db.de/iris-tts/timetable';

type AbfahrtenOptions = {
  lookahead: number,
  lookbehind: number,
};
const defaultOptions: AbfahrtenOptions = {
  lookahead: 150,
  lookbehind: 20,
};

export async function getAbfahrten(
  evaId: string,
  withRelated: boolean = true,
  options: AbfahrtenOptions = defaultOptions
) {
  const { station, relatedStations } = await getStation(evaId, 1);
  let relatedAbfahrten = Promise.resolve([]);

  if (withRelated) {
    relatedAbfahrten = Promise.all(relatedStations.map(s => getAbfahrten(s.eva, false))).then(a => flatten(a));
  }
  const date = new Date();
  const maxDate = addMinutes(date, options.lookahead);
  const segments = [date];

  for (let i = 1; i <= Math.ceil(options.lookahead / 60); i += 1) {
    segments.push(addHours(date, i));
  }
  for (let i = 1; i <= Math.ceil(options.lookbehind / 60); i += 1) {
    segments.push(subHours(date, i));
  }

  const timetable = new Timetable(evaId, segments, station.name);
  const abfahrten = flatten(await Promise.all([timetable.start(), relatedAbfahrten]));
  const filtered = uniqBy(abfahrten, 'id').filter(a => {
    const time = a.departure || a.arrival;

    return (
      isAfter(time, date) && (isBefore(time, maxDate) || isBefore(a.scheduledDeparture || a.scheduledArrival, maxDate))
    );
  });

  const sorted: any = filtered.sort((a, b) =>
    compareAsc(a.scheduledDeparture || a.scheduledArrival, b.scheduledDeparture || b.scheduledArrival)
  );

  return sorted;
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

const DBFHost = process.env.DBF_HOST || 'https://dbf.marudor.de';

// http://dbf.finalrewind.org/KD?mode=marudor&backend=iris&version=2
export function dbfAbfahrten(evaId: string) {
  return axios.get(`${DBFHost}/${evaId}?mode=marudor&backend=iris&version=4`).then(d => {
    if (d.data.error) {
      throw d.data;
    }
    const departures: Abfahrt[] = d.data.departures.map(dep => ({
      ...dep,
      // id: calculateTrainId(dep),
      ...splitTrainType(dep.train),
      longDistance: longDistanceRegex.test(dep.train),
    }));

    return departures;
  });
}

export async function ownAbfahrten(evaId: string) {
  const abfahrten = await getAbfahrten(evaId);
  const departures: Abfahrt[] = abfahrten.map(dep => ({
    ...dep,
    // id: calculateTrainId(dep),
    ...splitTrainType(dep.train),
    longDistance: longDistanceRegex.test(dep.train),
  }));

  return departures;
}
