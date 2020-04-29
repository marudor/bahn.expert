import { PlannedSequence } from 'types/planReihung';
import { useEffect, useState } from 'react';
import Axios from 'axios';

interface Props {
  trainNumber: string;
}

const PlanReihung = ({ trainNumber }: Props) => {
  const [planWR, setPlanWR] = useState<PlannedSequence>();

  useEffect(() => {
    Axios.get(`/api/reihung/v1/plan/${trainNumber}`)
      .then(({ data }) => {
        setPlanWR(data);
      })
      .catch(() => {});
  }, [trainNumber]);

  if (!planWR) return null;

  return <div>ICE Type nach Plan: {planWR.type}</div>;
};

export default PlanReihung;
