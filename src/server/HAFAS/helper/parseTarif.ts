import type {
	HafasTarifResponse,
	TarifFare,
	TarifFareSet,
} from '@/types/HAFAS/TripSearch';
import type { RouteTarifFare, RouteTarifFareSet } from '@/types/routing';

const parseFare = (fare: TarifFare): RouteTarifFare => {
	return {
		price: fare.prc,
		moreExpensiveAvailable: fare.isFromPrice,
		bookable: fare.isBookable,
		upsell: fare.isUpsell,
		targetContext: fare.targetCtx,
	};
};

const parseFareSet = (fareSet: TarifFareSet): RouteTarifFareSet => {
	return {
		fares: fareSet.fareL.map(parseFare),
	};
};

export default (
	tarifResponse?: HafasTarifResponse,
): RouteTarifFareSet[] | undefined => {
	if (tarifResponse?.statusCode !== 'OK') return;

	return tarifResponse.fareSetL.map(parseFareSet);
};
