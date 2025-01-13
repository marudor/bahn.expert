import type { ParsedSearchOnTripResponse } from '@/types/HAFAS/SearchOnTrip';
import type { RouteStop } from '@/types/routing';
import { isAfter } from 'date-fns';

export function calculateCurrentStopPlace(
	segment: ParsedSearchOnTripResponse,
): RouteStop | undefined {
	const currentDate = Date.now();

	return segment.stops.find((s) => {
		const stopInfo =
			s.departure && !s.departure.cancelled ? s.departure : s.arrival;

		return (
			stopInfo && !stopInfo.cancelled && isAfter(stopInfo.time, currentDate)
		);
	});
}
