import type { TcocL, TrnCmpSX } from '@/types/HAFAS';

export default (
  dTrnCmpSX?: TrnCmpSX,
  tcocL?: TcocL[],
):
  | {
      first?: number;
      second?: number;
    }
  | undefined => {
  if (!tcocL || !dTrnCmpSX?.tcocX) return;

  const auslastung: {
    first?: number;
    second?: number;
  } = {};

  for (const i of dTrnCmpSX.tcocX) {
    const a = tcocL[i];

    switch (a.c) {
      case 'FIRST': {
        auslastung.first = a.r;
        break;
      }
      case 'SECOND': {
        auslastung.second = a.r;
        break;
      }
      default: {
        break;
      }
    }
  }

  return auslastung;
};
