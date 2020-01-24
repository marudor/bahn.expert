import { PlannedSequence } from 'types/planReihung';
import Axios from 'axios';

const planWRUrl = 'https://lib.finalrewind.org/dbdb/ice_type.json';

let planWRMap: {
  [key: string]: PlannedSequence;
} = {};

async function fetchPlanWR() {
  try {
    planWRMap = (await Axios.get(planWRUrl)).data;
  } catch {
    // ignore
  }
}

if (process.env.NODE_ENV !== 'test') {
  fetchPlanWR();
  setInterval(fetchPlanWR, 8 * 60 * 1000 * 60);
}

export const getPlannedSequence = (
  trainNumber?: string
): PlannedSequence | undefined => {
  if (!trainNumber) return;

  return planWRMap[trainNumber];
};
