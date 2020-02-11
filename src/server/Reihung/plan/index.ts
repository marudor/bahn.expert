import { ParsedProduct } from 'types/HAFAS';
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

const allowedPlannedProductTypes = ['IC', 'ICE', 'EC', 'ECE'];

export const getPlannedSequence = (
  product: ParsedProduct
): PlannedSequence | undefined => {
  if (
    !product.number ||
    !allowedPlannedProductTypes.includes(product.type!) ||
    !product.admin?.startsWith('80')
  )
    return;

  return planWRMap[product.number];
};
