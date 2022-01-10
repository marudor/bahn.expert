import { useCallback, useState } from 'react';
import Axios from 'axios';
import constate from 'constate';
import type { AvailableBR, AvailableIdentifier } from 'types/coachSequence';
import type { EvaNumber } from 'types/common';
import type { FC } from 'react';
import type { TrainRunWithBR } from 'types/trainRuns';

const useInnerTrainRuns = () => {
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
            `/api/reihung/v4/runsPerDate/${date.toISOString()}`,
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

export const TrainRunProvider: FC = ({ children }) => {
  return <InnerTrainRunProvider>{children}</InnerTrainRunProvider>;
};
