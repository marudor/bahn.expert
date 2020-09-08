import { useEffect, useState } from 'react';
import Axios from 'axios';
import type { FC } from 'react';
import type { PlannedSequence } from 'types/planReihung';

interface Props {
  trainNumber: string;
}

export const PlanReihung: FC<Props> = ({ trainNumber }) => {
  const [planWR, setPlanWR] = useState<PlannedSequence>();

  useEffect(() => {
    Axios.get<PlannedSequence>(`/api/reihung/v1/plan/${trainNumber}`)
      .then((r) => {
        setPlanWR(r.data);
      })
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .catch(() => {});
  }, [trainNumber]);

  if (!planWR) return null;

  return <div>ICE Type nach Plan: {planWR.type}</div>;
};
