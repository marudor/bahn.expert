import { useCallback, useState } from 'react';
import Axios from 'axios';
import constate from 'constate';
import type { CoachSequenceInformation } from 'types/coachSequence';
import type { PropsWithChildren } from 'react';

async function fetchSequence(
  trainNumber: string,
  scheduledDeparture: Date,
  evaNumber: string,
  initialDeparture?: Date,
  trainCategory?: string,
): Promise<CoachSequenceInformation | undefined> {
  if (trainNumber === '0') {
    return undefined;
  }
  try {
    const r = await Axios.get<CoachSequenceInformation>(
      `/api/reihung/v4/wagen/${trainNumber}`,
      {
        params: {
          evaNumber,
          departure: scheduledDeparture.toISOString(),
          initialDeparture: initialDeparture?.toISOString(),
          category: trainCategory,
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

function useReihungInner(_p: PropsWithChildren<unknown>) {
  const [sequences, setSequences] = useState<{
    [key: string]: undefined | null | CoachSequenceInformation;
  }>({});
  const getSequences = useCallback(
    async (
      trainNumber: string,
      currentEvaNumber: string,
      scheduledDeparture: Date,
      initialDeparture?: Date,
      fallbackTrainNumbers: string[] = [],
      trainCategory?: string,
    ) => {
      let reihung: CoachSequenceInformation | undefined | null;

      const sequence = await Promise.all([
        fetchSequence(
          trainNumber,
          scheduledDeparture,
          currentEvaNumber,
          initialDeparture,
          trainCategory,
        ),
        ...fallbackTrainNumbers.map((fallback) =>
          fetchSequence(
            fallback,
            scheduledDeparture,
            currentEvaNumber,
            initialDeparture,
            trainCategory,
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
      reihung = sequence.find(Boolean);
      if (!reihung) {
        reihung = null;
      }
      const key = `${trainNumber}${currentEvaNumber}${scheduledDeparture.toISOString()}`;

      setSequences((oldReihungen) => ({
        ...oldReihungen,
        ...newSequence,
        [key]: reihung,
      }));
    },
    [],
  );
  const clearSequences = useCallback(() => setSequences({}), []);

  return { sequences, getSequences, clearSequences };
}

export const [ReihungenProvider, useSequences, useSequencesActions] = constate(
  useReihungInner,
  (v) => v.sequences,
  ({ sequences, ...actions }) => actions,
);
