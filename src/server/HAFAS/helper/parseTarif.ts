import type {
  HafasTarifResponse,
  TarifFare,
  TarifFareSet,
} from '@/types/HAFAS/TripSearch';
import type { Route$TarifFare, Route$TarifFareSet } from '@/types/routing';

const parseFare = (fare: TarifFare): Route$TarifFare => {
  return {
    price: fare.prc,
    moreExpensiveAvailable: fare.isFromPrice,
    bookable: fare.isBookable,
    upsell: fare.isUpsell,
    targetContext: fare.targetCtx,
  };
};

const parseFareSet = (fareSet: TarifFareSet): Route$TarifFareSet => {
  return {
    fares: fareSet.fareL.map(parseFare),
  };
};

export default (
  tarifResponse?: HafasTarifResponse,
): Route$TarifFareSet[] | undefined => {
  if (tarifResponse?.statusCode !== 'OK') return;

  return tarifResponse.fareSetL.map(parseFareSet);
};
