import { useCallback, useState } from 'react';
import Axios from 'axios';
import constate from 'constate';
import type { AvailableBR, AvailableIdentifier } from '@/types/coachSequence';
import type { EvaNumber } from '@/types/common';
import type { FC, PropsWithChildren } from 'react';
import type { TrainRunWithBR } from '@/types/trainRuns';

const useInnerTrainRuns = (_p: PropsWithChildren<unknown>) => {
  const [trainRuns, setTrainRuns] = useState<TrainRunWithBR[]>();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const fetchTrainRuns = useCallback(
    async (
      date: Date,
      baureihen?: AvailableBR[],
      identifier?: AvailableIdentifier[],
      stopsAt?: EvaNumber[],
    ) => {
      try {
        setTrainRuns(undefined);
        const runs = (
          await Axios.get<TrainRunWithBR[]>(
            `/api/coachSequence/v4/runsPerDate/${date.toISOString()}`,
            {
              params: {
                baureihen,
                identifier,
                stopsAt,
              },
            },
          )
        ).data;
        setTrainRuns(runs);
        setSelectedDate(date);
      } catch {
        // TODO: Error handling
      }
    },
    [],
  );

  return {
    trainRuns,
    selectedDate,
    fetchTrainRuns,
  };
};

export const [InnerTrainRunProvider, useTrainRuns] =
  constate(useInnerTrainRuns);

export const TrainRunProvider: FC<PropsWithChildren<unknown>> = ({
  children,
}) => {
  return <InnerTrainRunProvider>{children}</InnerTrainRunProvider>;
};
