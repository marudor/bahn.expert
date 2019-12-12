import { addDays, isBefore } from 'date-fns';
import { hasWR } from 'server/Reihung/hasWR';
import { ParsedProduct, TrnCmpSX } from 'types/HAFAS';

const allowdTypes = ['ICE', 'IC', 'TGV', 'EC', 'ECE', 'RJ', 'D'];

export default (
  scheduledTime: number,
  trnCmpSX?: TrnCmpSX,
  train?: ParsedProduct
) => {
  if (isBefore(addDays(new Date(), 1), scheduledTime)) return false;
  if (hasWR(train?.number)) return true;
  if (train?.type && allowdTypes.includes(train.type)) return true;

  if (trnCmpSX && trnCmpSX.tcM) return true;
};
