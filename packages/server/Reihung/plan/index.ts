import { isWithinInterval, parseISO } from 'date-fns';
import { logger } from 'server/logger';
import Axios from 'axios';
import type { ParsedProduct } from 'types/HAFAS';
import type { PlannedSequence, PlannedSequenceMeta } from 'types/planReihung';

const planWRUrl = 'https://lib.finalrewind.org/dbdb/db_zugbildung_v0.json';

let plannedSequences: PlannedSequenceMeta | undefined;

async function fetchPlanWR() {
  try {
    logger.debug('Fetching planWR');
    plannedSequences = (await Axios.get<PlannedSequenceMeta>(planWRUrl)).data;
    logger.debug('Fetched planWR');
  } catch (e) {
    logger.error(e, 'Fetching planWR failed');
  }
}

if (process.env.NODE_ENV !== 'test') {
  void fetchPlanWR();
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  setInterval(fetchPlanWR, 8 * 60 * 1000 * 60);
}

const allowedPlannedProductTypes = ['IC', 'ICE', 'EC', 'ECE'];

export const getPlannedSequence = (
  product: ParsedProduct,
): PlannedSequence | undefined => {
  if (
    !plannedSequences ||
    !product.number ||
    !allowedPlannedProductTypes.includes(product.type!)
  )
    return;

  const [start, end] = plannedSequences.valid
    .split('/')
    .map((r) => parseISO(r));
  console.log(
    start,
    end,
    isWithinInterval(new Date(), {
      start,
      end,
    }),
  );
  if (
    !isWithinInterval(new Date(), {
      start,
      end,
    })
  ) {
    return;
  }

  return plannedSequences.train[product.number];
};
