import { AuslastungsValue } from '@/types/routing';
import { getJourneyDetails } from '@/server/sbb/journeyDetails';
import { getSingleJourneyTrip } from '@/server/sbb/trip';
import type { EvaNumber } from '@/types/common';
import type { MinimalStopPlace } from '@/types/stopPlace';
import type { Route$Auslastung } from '@/types/routing';

async function findJourneyId(
  start: Omit<MinimalStopPlace, 'ril100'>,
  destination: Omit<MinimalStopPlace, 'ril100'>,
  trainNumber: string,
  departureTime: Date,
) {
  const trip = await getSingleJourneyTrip(
    start,
    destination,
    trainNumber,
    departureTime,
  );

  return trip?.legs[0]?.serviceJourney.id;
}

export function mapSBBOccupancy(
  sbbOccupancy: string,
): AuslastungsValue | undefined {
  switch (sbbOccupancy) {
    case 'LOW': {
      return AuslastungsValue.Gering;
    }
    case 'MEDIUM': {
      return AuslastungsValue.Hoch;
    }
    case 'HIGH': {
      return AuslastungsValue.SehrHoch;
    }
    case 'UNKNOWN': {
      return undefined;
    }
  }
}

export async function getOccupancy(
  start: Omit<MinimalStopPlace, 'ril100'>,
  destination: Omit<MinimalStopPlace, 'ril100'>,
  trainNumber: string,
  departureTime: Date,
): Promise<Record<EvaNumber, Route$Auslastung>> {
  try {
    const journeyId = await findJourneyId(
      start,
      destination,
      trainNumber,
      departureTime,
    );

    if (!journeyId) {
      return {};
    }

    const details = await getJourneyDetails(journeyId);

    const occupancyRecord: Record<EvaNumber, Route$Auslastung> = {};

    for (const stopPoint of details?.data.serviceJourneyById.stopPoints ?? []) {
      const occupancy: Route$Auslastung = {
        first: mapSBBOccupancy(stopPoint.occupancy.firstClass),
        second: mapSBBOccupancy(stopPoint.occupancy.secondClass),
      };

      if (occupancy.first || occupancy.second) {
        occupancyRecord[stopPoint.place.id] = occupancy;
      }
    }

    return occupancyRecord;
  } catch {
    return {};
  }
}
