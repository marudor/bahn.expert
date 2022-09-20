import { CacheDatabases, createNewCache } from 'server/cache';
import { coachSequenceConfiguration } from 'business-hub/config';
import { format, formatISO } from 'date-fns';
import { TransportsApi } from 'business-hub/generated/coachSequence';
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

const negativeHitCache = createNewCache<string, boolean>(
  CacheDatabases.NegativeNewSequence,
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

    console.debug(JSON.stringify(r.data));
    return r.data;
  } catch (e) {
    if (Axios.isAxiosError(e) && e.response?.status === 404) {
      void negativeHitCache.set(cacheKey, true);
    }
    return undefined;
  }
}
