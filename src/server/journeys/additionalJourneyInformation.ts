import Detail from '@/server/HAFAS/Detail';
import { Cache, CacheDatabase } from '@/server/cache';
import { getOccupancy } from '@/server/coachSequence/occupancy';
import { journeyDetails } from '@/server/journeys/v2/journeyDetails';
import type { AdditionalJourneyInformation } from '@/types/HAFAS/JourneyDetails';
import type { ParsedSearchOnTripResponse } from '@/types/HAFAS/SearchOnTrip';
import type { EvaNumber } from '@/types/common';
import type { RouteAuslastung } from '@/types/routing';

const additionalInformationCache = new Cache<
	AdditionalJourneyInformation | undefined
>(CacheDatabase.AdditionalJourneyInformation);

async function enrichTransportOccupancy(
	journeyId: string,
	additionalInformation: AdditionalJourneyInformation,
	providedJourneyDetails?: ParsedSearchOnTripResponse,
) {
	const occupancy = await getOccupancy(journeyId, providedJourneyDetails);
	if (occupancy) {
		additionalInformation.occupancy = occupancy;
	}
}

/**
 * This currently queries HAFAS to get operatorNames & occupancy
 */
export async function additionalJourneyInformation(
	trainName: string,
	journeyId: string,
	evaNumberAlongRoute?: string,
	initialDepartureDate?: Date,
): Promise<AdditionalJourneyInformation | undefined> {
	if (await additionalInformationCache.exists(journeyId)) {
		const additionalInformation =
			await additionalInformationCache.get(journeyId);
		if (additionalInformation) {
			await enrichTransportOccupancy(journeyId, additionalInformation);
		}
		return additionalInformation;
	}
	const risJourneyDetails = await journeyDetails(journeyId);
	const firstUncancelledStop = risJourneyDetails?.stops.find(
		(s) => !s.departure?.cancelled,
	);
	const hafasJourneyDetails = await Detail(
		trainName,
		undefined,
		firstUncancelledStop?.station.evaNumber || evaNumberAlongRoute,
		firstUncancelledStop?.departure?.scheduledTime || initialDepartureDate,
		true,
	);
	if (!hafasJourneyDetails) {
		return;
	}

	const occupancy: Record<EvaNumber, RouteAuslastung> = {};
	for (const stop of hafasJourneyDetails.stops) {
		if (stop.auslastung) {
			occupancy[stop.station.evaNumber] = stop.auslastung;
		}
	}
	const result: AdditionalJourneyInformation = {
		jid: hafasJourneyDetails.jid,
		occupancy,
		operatorName: hafasJourneyDetails.train.operator?.name,
		polyline: hafasJourneyDetails.polyline,
	};
	void additionalInformationCache.set(journeyId, result);
	await enrichTransportOccupancy(journeyId, result, risJourneyDetails);
	return result;
}
