import { DBCoachSequence } from 'server/coachSequence/DB';
import { differenceInHours } from 'date-fns';
import { OEBBCoachSequence } from 'server/coachSequence/OEBB';
import type { CoachSequenceInformation } from 'types/coachSequence';
import type { EvaNumber } from 'types/common';

export async function coachSequence(
  trainNumber: string,
  departure: Date,
  evaNumber?: EvaNumber,
  initialDeparture?: Date,
): Promise<CoachSequenceInformation | undefined> {
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

  return await DBCoachSequence(trainNumber, departure);
}
