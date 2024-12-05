import { HafasJourneyDetails } from '@/server/HAFAS/JourneyDetails';
import JourneyMatch from '@/server/HAFAS/JourneyMatch';
import createCtxRecon from '@/server/HAFAS/helper/createCtxRecon';
import { addIrisMessagesToDetails } from '@/server/journeys/journeyDetails';
import { AllowedHafasProfile } from '@/types/HAFAS';
import type { ParsedJourneyDetails } from '@/types/HAFAS/JourneyDetails';
import type { ParsedJourneyMatchResponse } from '@/types/HAFAS/JourneyMatch';
import type { ParsedSearchOnTripResponse } from '@/types/HAFAS/SearchOnTrip';
import type { RouteStop } from '@/types/routing';
import { isAfter } from 'date-fns';
import searchOnTrip from './SearchOnTrip';

export function calculateCurrentStopPlace(
	segment: ParsedSearchOnTripResponse,
	currentStopId?: string,
): RouteStop | undefined {
	const currentDate = Date.now();
	let currentStop: RouteStop | undefined;

	if (currentStopId) {
		currentStop = segment.stops.find(
			(s) => s.station.evaNumber === currentStopId,
		);
	}

	if (!currentStop) {
		currentStop = segment.stops.find((s) => {
			const stopInfo =
				s.departure && !s.departure.cancelled ? s.departure : s.arrival;

			return (
				stopInfo && !stopInfo.cancelled && isAfter(stopInfo.time, currentDate)
			);
		});
	}

	return currentStop;
}

const filterByAdministration = (
	journeys: ParsedJourneyMatchResponse[],
	administration?: string,
) => {
	if (!administration) return journeys;
	return journeys.filter(
		(j) => j.train.admin?.replaceAll('_', '') === administration,
	);
};

export default async (
	trainName: string,
	currentStopId?: string,
	station?: string,
	date: Date = new Date(),
	plainDetails = false,
	hafasProfile: AllowedHafasProfile = AllowedHafasProfile.DB,
	administration?: string,
	jid?: string,
): Promise<ParsedSearchOnTripResponse | undefined> => {
	let journeyDetails: ParsedJourneyDetails | undefined;
	if (!jid) {
		let possibleTrains: ParsedJourneyMatchResponse[] = [];

		possibleTrains = await JourneyMatch(
			{
				trainName,
				initialDepartureDate: date,
			},
			hafasProfile,
		);
		possibleTrains = filterByAdministration(possibleTrains, administration);

		if (!possibleTrains.length) {
			return undefined;
		}

		if (station) {
			while (!journeyDetails && possibleTrains.length) {
				const currentTrain = possibleTrains.shift()!;
				const maybeJourneyDetails = await HafasJourneyDetails(
					currentTrain.jid,
					hafasProfile,
				);
				if (!maybeJourneyDetails) {
					break;
				}
				for (const stop of maybeJourneyDetails.stops) {
					if (stop.station.evaNumber === station) {
						journeyDetails = maybeJourneyDetails;
						break;
					}
				}
			}
		} else {
			journeyDetails = await HafasJourneyDetails(
				possibleTrains[0].jid,
				hafasProfile,
			);
		}
	} else {
		journeyDetails = await HafasJourneyDetails(jid, hafasProfile);
	}

	if (!journeyDetails) return undefined;

	let relevantSegment: ParsedSearchOnTripResponse = {
		type: 'JNY',
		cancelled: journeyDetails.stops.every((s) => s.cancelled),
		finalDestination: journeyDetails.lastStop.station.name,
		jid: journeyDetails.jid,
		train: journeyDetails.train,
		segmentDestination: journeyDetails.lastStop.station,
		segmentStart: journeyDetails.firstStop.station,
		stops: journeyDetails.stops,
		messages: journeyDetails.messages,
		arrival: journeyDetails.lastStop.arrival,
		departure: journeyDetails.firstStop.departure,
		polyline: journeyDetails.polylines?.[0],
	};
	if (plainDetails) {
		return relevantSegment;
	}

	try {
		const route = await searchOnTrip(
			{
				ctxRecon: createCtxRecon({
					firstStop: journeyDetails.firstStop,
					lastStop: journeyDetails.lastStop,
					trainName: journeyDetails.train.name,
					messages: journeyDetails.messages,
				}),
				sotMode: 'RC',
			},
			hafasProfile,
		);

		relevantSegment = route.segments.find((s) => s.type === 'JNY')!;
	} catch {
		// we keep using the JourneyDetailsOne
	}

	if (relevantSegment.stops.length !== journeyDetails.stops.length) {
		for (const [index, stop] of journeyDetails.stops.entries()) {
			if (stop.additional) {
				relevantSegment.stops.splice(index, 0, stop);
			}
		}
	}

	const lastStop = relevantSegment.stops
		.filter((s) => s.arrival && !s.arrival.cancelled)
		.pop();

	if (currentStopId) {
		relevantSegment.currentStop = relevantSegment.stops.find(
			(s) => s.station.evaNumber === currentStopId,
		);
	}

	if (lastStop?.arrival?.delay == null) {
		for (const [index, stop] of relevantSegment.stops.entries()) {
			const jDetailStop = journeyDetails.stops[index];

			if (jDetailStop.station.evaNumber !== stop.station.evaNumber) continue;
			if (jDetailStop.arrival && stop.arrival) {
				stop.arrival.delay = jDetailStop.arrival.delay;
				stop.arrival.time = jDetailStop.arrival.time;
			}
			if (jDetailStop.departure && stop.departure) {
				stop.departure.delay = jDetailStop.departure.delay;
				stop.departure.time = jDetailStop.departure.time;
			}
		}
	}

	relevantSegment.currentStop = calculateCurrentStopPlace(
		relevantSegment,
		currentStopId,
	);

	await addIrisMessagesToDetails(relevantSegment);

	return relevantSegment;
};
