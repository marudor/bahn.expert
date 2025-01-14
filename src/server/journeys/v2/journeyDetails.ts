import { EventType } from '@/external/generated/risJourneysV2';
import type {
	CodeShare,
	JourneyEvent,
	TransportDestinationPortionWorkingRef,
	TransportDestinationRef,
	TransportWithDirection,
} from '@/external/generated/risJourneysV2';
import { getJourneyDetails } from '@/external/risJourneysV2';
import { calculateCurrentStopPlace } from '@/server/HAFAS/Detail';
import { getStopPlaceByEva } from '@/server/StopPlace/search';
import { addIrisMessagesToDetails } from '@/server/journeys/journeyDetails';
import { getLineFromNumber } from '@/server/journeys/lineNumberMapping';
import type { JourneyResponse } from '@/types/journey';
import type { RouteStop } from '@/types/routing';
import type { CommonStopInfo } from '@/types/stopPlace';
import {
	addHours,
	differenceInMinutes,
	isAfter,
	isBefore,
	parseISO,
	subHours,
} from 'date-fns';
import administrationNames from '../names.json';

interface StopInfoWithAdditional extends CommonStopInfo {
	additional?: boolean;
	travelsWith?: TransportDestinationPortionWorkingRef[];
	replacedBy?: TransportDestinationRef[];
	replacementFor?: TransportDestinationRef[];
	transport?: TransportWithDirection;
	codeShares?: CodeShare[];
}

function mapEventToCommonStopInfo(e: JourneyEvent): StopInfoWithAdditional {
	const scheduledTime = parseISO(e.timeSchedule);
	const time = parseISO(e.time);
	// Delay is undefined for scheduled stuff => no real time Information
	const delay =
		e.timeType === 'SCHEDULE'
			? undefined
			: differenceInMinutes(time, scheduledTime, {
					roundingMethod: 'floor',
				});

	return {
		scheduledTime,
		time,
		cancelled: e.cancelled,
		additional: e.additional,
		delay,
		scheduledPlatform: e.platformSchedule,
		platform: e.platform,
		isRealTime: e.timeType === 'REAL' || undefined,
		noPassengerChange: e.noPassengerChange,
		travelsWith: e.travelsWith,
		replacedBy: e.replacedBy,
		replacementFor: e.replacementFor,
		codeShares: e.codeshares,
		transport: e.transport,
		id: e.arrivalOrDepartureID,
	};
}

interface JourneyStop extends RouteStop {
	arrival?: StopInfoWithAdditional;
	departure?: StopInfoWithAdditional;
}

function newStopInfoIsAfter(stop: JourneyStop, event: JourneyEvent) {
	const timeSchedule = new Date(event.timeSchedule);
	if (
		event.type === 'ARRIVAL' &&
		stop.departure &&
		isAfter(timeSchedule, stop.departure.scheduledTime)
	) {
		return false;
	}
	if (
		event.type === EventType.Departure &&
		stop.arrival &&
		isBefore(timeSchedule, stop.arrival.scheduledTime)
	) {
		return false;
	}
	return true;
}

async function stopsFromEvents(events: JourneyEvent[]): Promise<JourneyStop[]> {
	const stops: JourneyStop[] = [];
	// debugger;
	for (const e of events) {
		const stopPlace = await getStopPlaceByEva(e.stopPlace.evaNumber);
		const stopInfo = mapEventToCommonStopInfo(e);
		const possibleStops = stops.filter(
			(s) =>
				s.station.evaNumber === e.stopPlace.evaNumber &&
				newStopInfoIsAfter(s, e),
		);
		let stop = possibleStops.length ? possibleStops.at(-1) : undefined;

		const stopType = e.type === EventType.Arrival ? 'arrival' : 'departure';
		if (!stop || stop[stopType]) {
			stop = {
				station: {
					evaNumber: e.stopPlace.evaNumber,
					name: (stopPlace || e.stopPlace).name
						.replaceAll('(', ' (')
						.replaceAll(')', ') ')
						.replaceAll('  ', ' ')
						.trim(),
					ril100: stopPlace?.ril100,
				},
			};
			stops.push(stop);
		}

		stop[stopType] = stopInfo;
	}

	for (const stop of stops) {
		const arrivalTransport = stop.arrival?.transport;
		const departureTransport = stop.departure?.transport;

		if (!arrivalTransport || !departureTransport) {
			continue;
		}

		if (
			arrivalTransport.category !== departureTransport.category ||
			arrivalTransport.line !== departureTransport.line
		) {
			stop.newTransport = departureTransport;
		}
		delete stop.arrival?.transport;
		delete stop.departure?.transport;
	}

	const seenReplacedBy: string[] = [];
	const seenReplacementFor: string[] = [];

	for (const s of stops) {
		s.codeShares = s.departure?.codeShares;

		if (
			(s.arrival?.cancelled || !s.arrival) &&
			(s.departure?.cancelled || !s.departure)
		) {
			s.cancelled = true;
		}
		if (
			(s.arrival?.additional || !s.arrival) &&
			(s.departure?.additional || !s.departure)
		) {
			s.additional = true;
		}

		if (s.arrival?.replacedBy) {
			s.arrival.replacedBy = s.arrival.replacedBy.filter(
				(r) => !seenReplacedBy.includes(r.journeyID),
			);
			for (const replacedBy of s.arrival.replacedBy) {
				seenReplacedBy.push(replacedBy.journeyID);
			}
		}
		if (s.departure?.replacedBy) {
			s.departure.replacedBy = s.departure.replacedBy.filter(
				(r) => !seenReplacedBy.includes(r.journeyID),
			);
			for (const replacedBy of s.departure.replacedBy) {
				seenReplacedBy.push(replacedBy.journeyID);
			}
		}

		if (s.arrival?.replacedBy || s.departure?.replacedBy) {
			s.replacedBy = [
				...(s.arrival?.replacedBy || []),
				...(s.departure?.replacedBy || []),
			];
		}
		delete s.arrival?.replacedBy;
		delete s.departure?.replacedBy;

		if (s.arrival?.replacementFor) {
			s.arrival.replacementFor = s.arrival.replacementFor.filter(
				(r) => !seenReplacementFor.includes(r.journeyID),
			);
			for (const replacementFor of s.arrival.replacementFor) {
				seenReplacementFor.push(replacementFor.journeyID);
			}
		}
		if (s.departure?.replacementFor) {
			s.departure.replacementFor = s.departure.replacementFor.filter(
				(r) => !seenReplacementFor.includes(r.journeyID),
			);
			for (const replacementFor of s.departure.replacementFor) {
				seenReplacementFor.push(replacementFor.journeyID);
			}
		}

		if (s.arrival?.replacementFor || s.departure?.replacementFor) {
			s.replacementFor = [
				...(s.arrival?.replacementFor || []),
				...(s.departure?.replacementFor || []),
			];
		}
		delete s.arrival?.replacementFor;
		delete s.departure?.replacementFor;

		if (s.arrival?.travelsWith) {
			// mapTravelsWith to split/join
			for (const travelsWith of s.arrival.travelsWith) {
				if (
					!s.departure?.travelsWith?.some(
						(t) => t.journeyID === travelsWith.journeyID,
					)
				) {
					s.splitsWith = s.splitsWith || [];
					s.splitsWith.push(travelsWith);
				}
			}
		}
		if (s.departure?.travelsWith) {
			for (const travelsWith of s.departure.travelsWith) {
				if (
					!s.arrival?.travelsWith?.some(
						(t) => t.journeyID === travelsWith.journeyID,
					)
				) {
					s.joinsWith = s.joinsWith || [];
					s.joinsWith.push(travelsWith);
				}
			}
		}

		delete s.departure?.travelsWith;
		delete s.arrival?.travelsWith;
	}

	return stops;
}

export async function journeyDetails(
	journeyId: string,
): Promise<JourneyResponse | undefined> {
	const journey = await getJourneyDetails(journeyId);
	if (!journey?.events?.length) {
		return undefined;
	}
	const firstEvent = journey.events[0];

	const stops = await stopsFromEvents(journey.events);
	if (!stops.length) {
		return undefined;
	}
	const firstStop = stops.at(0);
	const lastStop = stops.at(-1);

	if (!firstStop?.departure || !lastStop?.arrival) {
		return;
	}

	const operatorNames = [
		...new Set(
			journey.events.map(
				(e) =>
					// @ts-expect-error foo
					administrationNames[e.transport.administration.administrationID] ||
					e.transport.administration.operatorName,
			),
		),
	].join(', ');

	const result: JourneyResponse = {
		stops,
		segmentStart: firstStop.station,
		segmentDestination: lastStop.station,
		journeyId: journey.journeyID,
		arrival: lastStop.arrival,
		departure: firstStop.departure,
		finalDestination: journey.info.destination.name,
		train: {
			type: firstEvent.transport.category,
			number: firstEvent.transport.journeyNumber.toString(),
			name: `${firstEvent.transport.category} ${
				firstEvent.transport.line || firstEvent.transport.journeyNumber
			}`,
			admin: firstEvent.transport.administration.administrationID,
			line: getLineFromNumber(firstEvent.transport.journeyNumber.toString()),
			transportType: firstEvent.transport.type,
			operator: operatorNames,
		},
		type: 'JNY',
		cancelled: stops.every((s) => s.cancelled) || undefined,
		continuationFor: journey.continuationFor,
		continuationBy: journey.continuationBy,
	};

	result.currentStop = calculateCurrentStopPlace(result);

	if (
		isAfter(result.departure.scheduledTime, subHours(new Date(), 20)) &&
		isBefore(result.departure.scheduledTime, addHours(new Date(), 20))
	)
		await addIrisMessagesToDetails(result);

	return result;
}
