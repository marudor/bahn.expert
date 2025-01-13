import type {
	TransportDestinationRef,
	TransportOriginRef,
} from '@/external/generated/risJourneysV2';
import type { MatchVehicleID } from '@/external/generated/risTransports';
import type { HimIrisMessage } from '@/types/iris';
import type { RouteJourneySegmentTrain, RouteStop } from '@/types/routing';

export interface ParsedSearchOnTripResponse extends RouteJourneySegmentTrain {
	himMessages?: HimIrisMessage[];
	currentStop?: RouteStop;

	continuationFor?: TransportOriginRef[];
	continuationBy?: TransportDestinationRef[];
	previousJourneys?: MatchVehicleID[];
	nextJourneys?: MatchVehicleID[];
}
