import {
  addDays,
  differenceInHours,
  isWithinInterval,
  subDays,
} from 'date-fns';
import { DBCoachSequence } from '@/server/coachSequence/DB';
import { OEBBCoachSequence } from '@/server/coachSequence/OEBB';
import { SBBCoachSequence } from '@/server/coachSequence/SBB';
import type { CoachSequenceInformation } from '@/types/coachSequence';
import type { EvaNumber } from '@/types/common';

export async function coachSequence(
  trainNumber: string,
  departure: Date,
  evaNumber?: EvaNumber,
  initialDeparture?: Date,
  trainCategory?: string,
  arrivalEva?: string,
): Promise<CoachSequenceInformation | undefined> {
  if (
    !isWithinInterval(departure, {
      start: subDays(new Date(), 1),
      end: addDays(new Date(), 1),
    })
  ) {
    return;
  }

  if (evaNumber && evaNumber.startsWith('85') && arrivalEva) {
    const sbbSequence = await SBBCoachSequence(
      evaNumber,
      trainNumber,
      departure,
      arrivalEva,
    );

    return sbbSequence;
  }

  if (evaNumber && initialDeparture && !evaNumber.startsWith('80')) {
    const oebbSequence = await OEBBCoachSequence(
      trainNumber,
      evaNumber,
      initialDeparture,
    );
    if (oebbSequence) return oebbSequence;
  }

  // no need to check for stuff more than 24 hours in the future, we dont have that
  if (differenceInHours(departure, new Date()) >= 24) {
    return undefined;
  }

  return await DBCoachSequence(
    trainNumber,
    departure,
    initialDeparture,
    trainCategory,
    evaNumber,
  );
}
