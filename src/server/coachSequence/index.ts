import {
  addDays,
  differenceInHours,
  isWithinInterval,
  subDays,
} from 'date-fns';
import { DBCoachSequence } from '@/server/coachSequence/DB';
import { newDBCoachSequence } from '@/server/coachSequence/newDB';
import { OEBBCoachSequence } from '@/server/coachSequence/OEBB';
import type { CoachSequenceInformation } from '@/types/coachSequence';
import type { EvaNumber } from '@/types/common';

export async function coachSequence(
  trainNumber: string,
  departure: Date,
  evaNumber?: EvaNumber,
  initialDeparture?: Date,
  trainCategory?: string,
  administration?: string,
): Promise<CoachSequenceInformation | undefined> {
  if (
    !isWithinInterval(departure, {
      start: subDays(new Date(), 1),
      end: addDays(new Date(), 1),
    })
  ) {
    return;
  }
  if (evaNumber && initialDeparture && !evaNumber.startsWith('80')) {
    const oebbSequence = await OEBBCoachSequence(
      trainNumber,
      evaNumber,
      initialDeparture,
    );
    if (oebbSequence) return oebbSequence;
  }

  // no need to check for stuff more than 36 hours in the future, we dont have that
  if (differenceInHours(departure, new Date()) >= 36) {
    return undefined;
  }

  let newDBSequencePromise: Promise<CoachSequenceInformation | void> =
    Promise.resolve();
  const dbSequencePromise = DBCoachSequence(
    trainNumber,
    departure,
    initialDeparture,
    trainCategory,
    evaNumber,
    administration,
  );
  // We only use the new API for ICEs (for now)
  if (evaNumber && initialDeparture && trainCategory === 'ICE') {
    newDBSequencePromise = newDBCoachSequence(
      trainCategory,
      Number.parseInt(trainNumber),
      evaNumber,
      departure,
      initialDeparture,
    );
  }

  const newDBSequence = await newDBSequencePromise;
  if (newDBSequence) {
    return newDBSequence;
  }
  return await dbSequencePromise;
}
