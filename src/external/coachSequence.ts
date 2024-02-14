import {
  addHours,
  format,
  formatISO,
  isWithinInterval,
  subHours,
} from 'date-fns';
import { axiosUpstreamInterceptor } from '@/server/admin';
import { Cache, CacheDatabase } from '@/server/cache';
import { Configuration as CoachSequenceConfiguration } from '@/external/generated/coachSequence';
import { logger } from '@/server/logger';
import { TransportsApi } from '@/external/generated/coachSequence';
import Axios from 'axios';
import type { VehicleSequenceDeparture } from '@/external/generated/coachSequence';

const coachSequenceConfiguration = new CoachSequenceConfiguration({
  basePath: process.env.COACH_SEQUENCE_URL,
  baseOptions: {
    headers: {
      'DB-Api-Key': process.env.COACH_SEQUENCE_CLIENT_SECRET,
      'DB-Client-Id': process.env.COACH_SEQUENCE_CLIENT_ID,
    },
  },
});

const axiosWithTimeout = Axios.create({
  timeout: 4500,
});

axiosUpstreamInterceptor(axiosWithTimeout, 'coachSequence-newDB');

const coachSequenceClient = new TransportsApi(
  coachSequenceConfiguration,
  undefined,
  axiosWithTimeout,
);

const negativeHitCache = new Cache<boolean>(CacheDatabase.NegativeNewSequence);

export function isWithin20Hours(date: Date): boolean {
  const start = subHours(new Date(), 20);
  const end = addHours(new Date(), 20);
  return isWithinInterval(date, {
    start,
    end,
  });
}

export async function getDepartureSequence(
  trainCategory: string,
  trainNumber: number,
  evaNumber: string,
  plannedDepartureDate: Date,
  initialDepartureDate: Date,
): Promise<VehicleSequenceDeparture | undefined> {
  if (!isWithin20Hours(plannedDepartureDate)) {
    return undefined;
  }
  const cacheKey = `${trainCategory}${trainNumber}${evaNumber}${plannedDepartureDate.toISOString()}${initialDepartureDate.toISOString()}`;
  try {
    const wasNotFound = await negativeHitCache.exists(cacheKey);
    if (wasNotFound) {
      return undefined;
    }
    logger.debug('Trying new coachSequence');
    const r = await coachSequenceClient.vehicleSequenceDepartureUnmatched({
      category: trainCategory,
      number: trainNumber,
      evaNumber,
      date: format(initialDepartureDate, 'yyyy-MM-dd'),
      time: formatISO(plannedDepartureDate),
      includeAmenities: true,
      // includeOccupancy: 'DETAIL',
      includePosition: true,
    });
    return r.data;
  } catch (e) {
    logger.debug(e, `new coach sequence errored (${e.response?.status})`);
    if (Axios.isAxiosError(e) && e.response?.status === 404) {
      void negativeHitCache.set(cacheKey, true);
    }
    return undefined;
  }
}
