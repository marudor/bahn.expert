import Detail from '@/server/HAFAS/Detail';
import { Cache, CacheDatabase } from '@/server/cache';
import { journeyDetails } from '@/server/journeys/v2/journeyDetails';
import { getOccupancy } from '@/server/sbb/occupancy';
import type { AdditionalJourneyInformation } from '@/types/HAFAS/JourneyDetails';
import type { EvaNumber } from '@/types/common';
import type { RouteAuslastung } from '@/types/routing';

const additionalInformationCache = new Cache<
	AdditionalJourneyInformation | undefined
>(CacheDatabase.AdditionalJourneyInformation);

/**
 * This currently queries HAFAS to get operatorNames & occupancy
 * Also queries SBB for occupancy
 */
export async function additionalJourneyInformation(
	trainName: string,
	journeyId: string,
	evaNumberAlongRoute?: string,
	initialDepartureDate?: Date,
): Promise<AdditionalJourneyInformation | undefined> {
	if (await additionalInformationCache.exists(journeyId)) {
		return await additionalInformationCache.get(journeyId);
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

	let sbbOccupancy = {};

	if (
		hafasJourneyDetails.segmentStart.evaNumber.startsWith('85') ||
		hafasJourneyDetails.segmentDestination.evaNumber.startsWith('85') ||
		hafasJourneyDetails.train.operator?.name.startsWith('SBB')
	) {
		sbbOccupancy = await getOccupancy(
			hafasJourneyDetails.segmentStart,
			hafasJourneyDetails.segmentDestination,
			hafasJourneyDetails.train.number!,
			hafasJourneyDetails.departure.scheduledTime,
		);
	}

	const occupancy: Record<EvaNumber, RouteAuslastung> = {
		...sbbOccupancy,
	};
	for (const stop of hafasJourneyDetails.stops) {
		if (stop.auslastung) {
			occupancy[stop.station.evaNumber] = stop.auslastung;
		}
	}
	if (hafasJourneyDetails.train.operator || Object.keys(occupancy).length) {
		const result: AdditionalJourneyInformation = {
			jid: hafasJourneyDetails.jid,
			occupancy,
			operatorName: hafasJourneyDetails.train.operator?.name,
			polyline: hafasJourneyDetails.polyline,
		};

		void additionalInformationCache.set(journeyId, result);
		return result;
	}
}
