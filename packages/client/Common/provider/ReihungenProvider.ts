import { useCallback, useState } from 'react';
import Axios from 'axios';
import constate from 'constate';
import type { CoachSequenceInformation } from 'types/coachSequence';

async function fetchSequence(
  trainNumber: string,
  scheduledDeparture: Date,
  evaNumber: string,
  initialDeparture?: Date,
): Promise<CoachSequenceInformation | undefined> {
  try {
    const r = await Axios.get<CoachSequenceInformation>(
      `/api/reihung/v4/wagen/${trainNumber}`,
      {
        params: {
          evaNumber,
          departure: scheduledDeparture.toISOString(),
          initialDeparture: initialDeparture?.toISOString(),
        },
      },
    );
    return r.data;
  } catch (e) {
    return undefined;
  }
}

export const sequenceId = (
  trainNumber: string,
  currentEvaNumber: string,
  scheduledDeparture: Date,
): string =>
  `${trainNumber}${currentEvaNumber}${scheduledDeparture.toISOString()}`;

function useReihungInner() {
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
    ) => {
      let reihung: CoachSequenceInformation | undefined | null;

      const sequence = await Promise.all([
        fetchSequence(
          trainNumber,
          scheduledDeparture,
          currentEvaNumber,
          initialDeparture,
        ),
        ...fallbackTrainNumbers.map((fallback) =>
          fetchSequence(
            fallback,
            scheduledDeparture,
            currentEvaNumber,
            initialDeparture,
          ),
        ),
      ]);
      const newSequence = sequence.reduce((agg, s) => {
        if (s) {
          agg[
            sequenceId(s.product.number, currentEvaNumber, scheduledDeparture)
          ] = s;
        }
        return agg;
      }, {} as Record<string, CoachSequenceInformation>);
      reihung = sequence.find((f) => f);
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
