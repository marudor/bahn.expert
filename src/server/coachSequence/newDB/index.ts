import { getDepartureSequence } from '@/external/coachSequence';
import { mapInformation } from '@/server/coachSequence/newDB/newDBMapping';
import type { CoachSequenceInformation } from '@/types/coachSequence';

const isDisabled = process.env.COACH_SEQUENCE_DISABLED
  ? JSON.parse(process.env.COACH_SEQUENCE_DISABLED)
  : false;

export async function newDBCoachSequence(
  trainCategory: string,
  trainNumber: number,
  evaNumber: string,
  plannedDepartureDate: Date,
  initialDepartureDate: Date,
): Promise<CoachSequenceInformation | undefined> {
  if (isDisabled) {
    return undefined;
  }
  const sequence = await getDepartureSequence(
    trainCategory,
    trainNumber,
    evaNumber,
    plannedDepartureDate,
    initialDepartureDate,
  );

  const mappedSequence = mapInformation(
    sequence,
    trainCategory,
    trainNumber,
    evaNumber,
  );
  return mappedSequence;
}
