import { addDays, isBefore } from 'date-fns';
import { TrnCmpSX } from 'types/HAFAS';

const allowdTypes = ['ICE', 'IC', 'TGV', 'EC', 'ECE', 'RJ', 'D'];

export default (
  scheduledTime: number,
  trnCmpSX?: TrnCmpSX,
  trainType?: string
) => {
  if (isBefore(addDays(new Date(), 1), scheduledTime)) return false;
  if (trainType && allowdTypes.includes(trainType)) return true;

  if (trnCmpSX && trnCmpSX.tcM) return true;
};
