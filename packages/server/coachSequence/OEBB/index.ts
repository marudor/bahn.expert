import { info } from 'oebb';
import { mapInformation } from 'server/coachSequence/OEBB/OEBBMapping';
import type { CoachSequenceInformation } from 'types/coachSequence';

export async function OEBBCoachSequence(
  trainNumber: string,
  evaNumber: string,
  initialDeparture: Date,
): Promise<CoachSequenceInformation | undefined> {
  const rawSequence = await info(
    Number.parseInt(trainNumber),
    evaNumber,
    initialDeparture,
  );

  return mapInformation(rawSequence);
}
