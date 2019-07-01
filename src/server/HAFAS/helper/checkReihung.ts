import { TrnCmpSX } from 'types/HAFAS';

const allowdTypes = ['ICE', 'IC', 'TGV', 'EC', 'ECE', 'RJ', 'D'];

export default (trnCmpSX?: TrnCmpSX, trainType?: string) => {
  if (trainType && allowdTypes.includes(trainType)) return true;

  if (trnCmpSX && trnCmpSX.tcM) return true;
};
