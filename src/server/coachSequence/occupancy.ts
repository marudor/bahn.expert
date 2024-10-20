import type { Occupancy } from '@/external/generated/risTransports';
import { getJourneyOccupancy } from '@/external/risTransports/occupancy';
import { journeyDetails as fetchJourneyDetails } from '@/server/journeys/v2/journeyDetails';
import type { ParsedSearchOnTripResponse } from '@/types/HAFAS/SearchOnTrip';
import { AuslastungsValue, type RouteAuslastung } from '@/types/routing';

export function mapSingleOccupancy(
	occupancy?: string,
): AuslastungsValue | undefined {
	switch (occupancy) {
		case 'OVERCROWDED':
			return AuslastungsValue.Ausgebucht;
		case 'HIGH':
			return AuslastungsValue.SehrHoch;
		case 'MIDDLE':
			return AuslastungsValue.Hoch;
		case 'LOW':
			return AuslastungsValue.Gering;
		default:
			return;
	}
}

function mapOccupancy(stopOccupancy: Occupancy): RouteAuslastung {
	return {
		first: mapSingleOccupancy(stopOccupancy.levelFirstClass),
		second: mapSingleOccupancy(stopOccupancy.levelEconomyClass),
	};
}

export async function getOccupancy(
	journeyId: string,
	providedJourneyDetails?: ParsedSearchOnTripResponse,
) {
	const journeyDetails =
		providedJourneyDetails || (await fetchJourneyDetails(journeyId));
	if (!journeyDetails) {
		return;
	}

	const risTransportsOccupancy = await getJourneyOccupancy({
		journeyId,
		administration: journeyDetails.train.admin,
	});
	if (!risTransportsOccupancy?.departures?.length) {
		return;
	}

	const occupancy: Record<string, RouteAuslastung> = {};
	for (const stop of risTransportsOccupancy.departures) {
		const journeyStop = journeyDetails.stops.find(
			(s) => s.departure?.id === stop.departureID,
		);
		if (journeyStop) {
			occupancy[journeyStop.station.evaNumber] = mapOccupancy(stop.occupancy);
		}
	}
	return occupancy;
}
