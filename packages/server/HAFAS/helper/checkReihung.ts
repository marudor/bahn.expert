import { addDays, isBefore } from 'date-fns';
import type { ParsedProduct, TrnCmpSX } from 'types/HAFAS';

const allowdTypes = ['ICE', 'IC', 'TGV', 'EC', 'ECE', 'RJ', 'D'];

export default (
  scheduledTime: number,
  trnCmpSX?: TrnCmpSX,
  train?: ParsedProduct,
): boolean | undefined => {
  if (isBefore(addDays(new Date(), 1), scheduledTime)) return false;
  if (train?.type && allowdTypes.includes(train.type)) return true;

  if (trnCmpSX && trnCmpSX.tcM) return true;
};
