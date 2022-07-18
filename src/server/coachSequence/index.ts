import { DBCoachSequence } from 'server/coachSequence/DB';
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

  return await DBCoachSequence(trainNumber, departure);
}
