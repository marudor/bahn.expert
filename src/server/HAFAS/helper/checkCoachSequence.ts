import { addDays, isBefore } from 'date-fns';
import type { ParsedProduct, TrnCmpSX } from '@/types/HAFAS';

const allowdTypes = new Set(['ICE', 'IC', 'TGV', 'EC', 'ECE', 'RJ', 'D']);

export default (
  scheduledTime: Date,
  trnCmpSX?: TrnCmpSX,
  train?: ParsedProduct,
): boolean | undefined => {
  if (isBefore(addDays(new Date(), 1), scheduledTime)) return false;
  if (train?.type && allowdTypes.has(train.type)) return true;

  if (trnCmpSX?.tcM) return true;
};
