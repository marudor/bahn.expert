import { Cache, CacheDatabase } from 'server/cache';
import { coachSequenceConfiguration } from 'business-hub/config';
import { format, formatISO } from 'date-fns';
import { logger } from 'server/logger';
import { TransportsApi } from 'business-hub/generated/coachSequence';
import { UpstremaApiRequestMetric } from 'server/admin';
import Axios from 'axios';
import type { VehicleSequenceDeparture } from 'business-hub/generated/coachSequence';

const axiosWithTimeout = Axios.create({
  timeout: 4500,
});

const coachSequenceClient = new TransportsApi(
  coachSequenceConfiguration,
  undefined,
  axiosWithTimeout,
);

const negativeHitCache = new Cache<string, boolean>(
  CacheDatabase.NegativeNewSequence,
  12 * 60 * 60,
);

export async function getDepartureSequence(
  trainCategory: string,
  trainNumber: number,
  evaNumber: string,
  plannedDepartureDate: Date,
  initialDepartureDate: Date,
): Promise<VehicleSequenceDeparture | undefined> {
  const cacheKey = `${trainCategory}${trainNumber}${evaNumber}${plannedDepartureDate.toISOString()}${initialDepartureDate.toISOString()}`;
  try {
    const wasNotFound = await negativeHitCache.exists(cacheKey);
    if (wasNotFound) {
      return undefined;
    }
    logger.debug('Trying new coachSequence');
    UpstremaApiRequestMetric.inc({
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
