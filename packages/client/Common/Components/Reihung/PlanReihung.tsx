import { useEffect, useState } from 'react';
import request from 'umi-request';
import type { PlannedSequence } from 'types/planReihung';

interface Props {
  trainNumber: string;
}

export const PlanReihung = ({ trainNumber }: Props) => {
  const [planWR, setPlanWR] = useState<PlannedSequence>();

  useEffect(() => {
    request
      .get<PlannedSequence>(`/api/reihung/v1/plan/${trainNumber}`)
      .then((data) => {
        setPlanWR(data);
      })
      .catch(() => {});
  }, [trainNumber]);

  if (!planWR) return null;

  return <div>ICE Type nach Plan: {planWR.type}</div>;
};
