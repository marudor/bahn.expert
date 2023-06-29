import { addMinutes, subMinutes } from 'date-fns';
import {
  getAbfahrten,
  sortAbfahrt,
  timeByReal,
  timeByScheduled,
} from '@/server/iris';
import { getGroups } from '@/server/StopPlace/search';
import Axios from 'axios';
import Qs from 'qs';
import type { Abfahrt, AbfahrtenResult } from '@/types/iris';

const privateAxios = Axios.create({
  baseURL: process.env.PRIVATE_API_URL,
  headers: {
    'x-api-key': process.env.PRIVATE_API_KEY || '',
  },
  paramsSerializer: {
    serialize: (params: any) =>
      Qs.stringify(params, {
        arrayFormat: 'repeat',
      }),
  },
});

export async function getPrivateAbfahrten(
  evaNumber: string,
  lookahead: number,
  lookbehind: number,
  startTime: Date = new Date(),
): Promise<AbfahrtenResult> {
  const stopPlaceGroups = await getGroups(evaNumber);
  const evaNumbers = stopPlaceGroups.STATION || [evaNumber];
  const absoluteStartTime = subMinutes(startTime, lookbehind);
  const absoluteEndTime = addMinutes(startTime, lookahead);

  const irisPromise = getAbfahrten(
    evaNumber,
    true,
    {
      lookahead,
      lookbehind,
    },
    true,
    evaNumbers,
  );
  const result = (
    await privateAxios.get('/board/v1/departures', {
      params: {
        evaNumbers,
        startTime: absoluteStartTime,
        endTime: absoluteEndTime,
      },
    })
  ).data;

  result.departures.sort(sortAbfahrt(timeByScheduled));
  result.lookbehind.sort(sortAbfahrt(timeByReal));

  const irisResult = await irisPromise;
  const irisResultByProduct: Record<string, Abfahrt> = {};
  for (const abfahrt of [
    ...irisResult.departures,
    ...irisResult.lookbehind,
    ...Object.values(irisResult.wings || {}),
  ]) {
    const key = `${abfahrt.train.number}${(
      abfahrt.departure || abfahrt.arrival
    )?.scheduledTime?.toISOString()}`;
    irisResultByProduct[key] = abfahrt;
  }

  for (const boardAbfahrt of [
    ...result.departures,
    ...result.lookbehind,
    ...Object.values(result.wings || {}),
  ]) {
    const key = `${boardAbfahrt.train.number}${(
      boardAbfahrt.departure || boardAbfahrt.arrival
    )?.scheduledTime}`;
    const irisAbfahrt = irisResultByProduct[key];
    if (irisAbfahrt) {
      boardAbfahrt.messages = irisAbfahrt.messages;
    }
  }

  return result;
}
