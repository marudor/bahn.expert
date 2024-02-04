import { info } from '@/oebb/index';
import { mapInformation } from '@/server/coachSequence/OEBB/OEBBMapping';
import { UpstreamApiRequestMetric } from '@/server/admin';
import type { CoachSequenceInformation } from '@/types/coachSequence';

export async function OEBBCoachSequence(
  trainNumber: string,
  evaNumber: string,
  initialDeparture: Date,
): Promise<CoachSequenceInformation | undefined> {
  UpstreamApiRequestMetric.inc({
    api: 'coachSequence-OEBB',
  });
  const rawSequence = await info(
    Number.parseInt(trainNumber),
    evaNumber,
    initialDeparture,
  );

  return mapInformation(rawSequence);
}
