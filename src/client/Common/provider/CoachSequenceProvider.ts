import { useCallback, useState } from 'react';
import Axios from 'axios';
import constate from 'constate';
import type { CoachSequenceInformation } from '@/types/coachSequence';
import type { PropsWithChildren } from 'react';
import type { TrainInfo } from '@/types/iris';

export type FallbackTrainsForCoachSequence = Pick<
  TrainInfo,
  'admin' | 'number' | 'type'
>;

async function fetchSequence(
  trainNumber: string,
  scheduledDeparture: Date,
  evaNumber: string,
  initialDeparture?: Date,
  trainCategory?: string,
  administration?: string,
  lastArrivalEva?: string,
): Promise<CoachSequenceInformation | undefined> {
  if (trainNumber === '0') {
    return undefined;
  }
  try {
    const r = await Axios.get<CoachSequenceInformation>(
      `/api/coachSequence/v4/wagen/${trainNumber}`,
      {
        params: {
          evaNumber,
          departure: scheduledDeparture.toISOString(),
          initialDeparture: initialDeparture?.toISOString(),
          category: trainCategory,
          administration,
          lastArrivalEva,
        },
      },
    );
    return r.data;
  } catch {
    return undefined;
  }
}

export const sequenceId = (
  trainNumber: string,
  currentEvaNumber: string,
  scheduledDeparture: Date,
): string =>
  `${trainNumber}${currentEvaNumber}${scheduledDeparture.toISOString()}`;

function useCoachSequences(_p: PropsWithChildren<unknown>) {
  const [sequences, setSequences] = useState<
    Record<string, undefined | null | CoachSequenceInformation>
  >({});
  const getSequences = useCallback(
    async (
      trainNumber: string,
      currentEvaNumber: string,
      scheduledDeparture: Date,
      initialDeparture?: Date,
      fallback: FallbackTrainsForCoachSequence[] = [],
      trainCategory?: string,
      administration?: string,
      lastArrivalEva?: string,
    ) => {
      let coachSequence: CoachSequenceInformation | undefined | null;

      const sequence = await Promise.all([
        fetchSequence(
          trainNumber,
          scheduledDeparture,
          currentEvaNumber,
          initialDeparture,
          trainCategory,
          administration,
          lastArrivalEva,
        ),
        ...fallback.map((fallbackTrain) =>
          fetchSequence(
            fallbackTrain.number,
            scheduledDeparture,
            currentEvaNumber,
            initialDeparture,
            fallbackTrain.type,
            fallbackTrain.admin,
            lastArrivalEva,
          ),
        ),
      ]);
      const newSequence: Record<string, CoachSequenceInformation> = {};
      for (const s of sequence) {
        if (s) {
          newSequence[
            sequenceId(s.product.number, currentEvaNumber, scheduledDeparture)
          ] = s;
        }
      }
      coachSequence = sequence.find(Boolean);
      if (!coachSequence) {
        coachSequence = null;
      }
      const key = `${trainNumber}${currentEvaNumber}${scheduledDeparture.toISOString()}`;

      setSequences((oldSequence) => ({
        ...oldSequence,
        ...newSequence,
        [key]: coachSequence,
      }));
    },
    [],
  );
  const clearSequences = useCallback(() => setSequences({}), []);

  return { sequences, getSequences, clearSequences };
}

export const [CoachSequenceProvider, useSequences, useSequencesActions] =
  constate(
    useCoachSequences,
    (v) => v.sequences,
    ({ sequences, ...actions }) => actions,
  );
