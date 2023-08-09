import {
  addHours,
  format,
  formatISO,
  isWithinInterval,
  subHours,
} from 'date-fns';
import { Cache, CacheDatabase } from '@/server/cache';
import { coachSequenceConfiguration } from '@/external/config';
import { logger } from '@/server/logger';
import { TransportsApi } from '@/external/generated/coachSequence';
import { UpstreamApiRequestMetric } from '@/server/admin';
import Axios from 'axios';
import type { VehicleSequenceDeparture } from '@/external/generated/coachSequence';

const axiosWithTimeout = Axios.create({
  timeout: 4500,
});

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
    UpstreamApiRequestMetric.inc({
      api: 'coachSequence-newDB',
    });
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
