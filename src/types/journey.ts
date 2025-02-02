import type {
	TransportDestinationRef,
	TransportOriginRef,
} from '@/external/generated/risJourneysV2';
import type { MatchVehicleID } from '@/external/generated/risTransports';
import type { RouteJourneySegmentTrain, RouteStop } from '@/types/routing';

export interface JourneyResponse extends RouteJourneySegmentTrain {
	currentStop?: RouteStop;

	continuationFor?: TransportOriginRef[];
	continuationBy?: TransportDestinationRef[];
	previousJourneys?: MatchVehicleID[];
	nextJourneys?: MatchVehicleID[];
}

export interface JourneyFindResponse {
	train: CommonProductInfo;
	stops: RouteStop[];
	journeyId: string;
	firstStop: RouteStop;
	lastStop: RouteStop;
}

export interface CommonProductInfo {
	name: string;
	line?: string;
	number?: string;
	/**
	 * This is actually category
	 */
	type?: string;
	operator?: string;
	admin?: string;
	// was TRANSPORT_TYPE ENUM before
	transportType: string;
}
