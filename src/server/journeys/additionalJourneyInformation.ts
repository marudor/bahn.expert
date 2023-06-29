import { Cache, CacheDatabase } from '@/server/cache';
import { getOccupancy } from '@/server/sbb/occupancy';
import Detail from '@/server/HAFAS/Detail';
import type { AdditionalJourneyInformation } from '@/types/HAFAS/JourneyDetails';
import type { EvaNumber } from '@/types/common';
import type { Route$Auslastung } from '@/types/routing';

const additionalInformationCache = new Cache<
  string,
  AdditionalJourneyInformation | undefined
>(CacheDatabase.AdditionalJourneyInformation, 10 * 60);

/**
 * This currently queries HAFAS to get operatorNames & occupancy
 * Also queries SBB for occupancy
 */
export async function additionalJourneyInformation(
  trainName: string,
  journeyId: string,
  evaNumberAlongRoute?: string,
  initialDepartureDate?: Date,
): Promise<AdditionalJourneyInformation | undefined> {
  if (await additionalInformationCache.exists(journeyId)) {
    return await additionalInformationCache.get(journeyId);
  }
  const journeyDetails = await Detail(
    trainName,
    undefined,
    evaNumberAlongRoute,
    initialDepartureDate,
    true,
  );
  if (!journeyDetails) {
    return;
  }

  const sbbOccupancy = await getOccupancy(
    journeyDetails.segmentStart.name,
    journeyDetails.segmentDestination.name,
    journeyDetails.train.number!,
    journeyDetails.departure.scheduledTime,
  );

  const occupancy: Record<EvaNumber, Route$Auslastung> = {
    ...sbbOccupancy,
  };
  for (const stop of journeyDetails.stops) {
    if (stop.auslastung) {
      occupancy[stop.station.evaNumber] = stop.auslastung;
    }
  }
  if (journeyDetails.train.operator || Object.keys(occupancy).length) {
    const result: AdditionalJourneyInformation = {
      occupancy,
      operatorName: journeyDetails.train.operator?.name,
      polyline: journeyDetails.polyline,
    };

    void additionalInformationCache.set(journeyId, result);
    return result;
  }
}
