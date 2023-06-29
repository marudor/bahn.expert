import { fetchSBBCoachSequence } from '@/server/sbb/coachSequence';
import { mapSBBCoachSequence } from '@/server/coachSequence/SBB/SBBMapping';
import { UpstreamApiRequestMetric } from '@/server/admin';
import type { CoachSequenceInformation } from '@/types/coachSequence';

export async function SBBCoachSequence(
  evaNumber: string,
  initialDepartureEva: string,
  trainNumber: string,
  departureTime: Date,
): Promise<CoachSequenceInformation | undefined> {
  UpstreamApiRequestMetric.inc({
    api: 'coachSequence-SBB',
  });

  const rawSequence = await fetchSBBCoachSequence(
    evaNumber,
    initialDepartureEva,
    trainNumber,
    departureTime,
  );

  return mapSBBCoachSequence(rawSequence);
}
