import { TcocL, TrnCmpSX } from 'types/HAFAS';

export default (dTrnCmpSX?: TrnCmpSX, tcocL?: TcocL[]) => {
  if (!tcocL || !dTrnCmpSX || !dTrnCmpSX.tcocX) return;

  const auslastung: {
    first?: number;
    second?: number;
  } = {};

  dTrnCmpSX.tcocX.forEach((i) => {
    const a = tcocL[i];

    switch (a.c) {
      case 'FIRST':
        auslastung.first = a.r;
        break;
      case 'SECOND':
        auslastung.second = a.r;
        break;
      default:
        break;
    }
  });

  return auslastung;
};
