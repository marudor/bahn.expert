import { EventType, TimeType } from '@/external/generated/risJourneys';
import type { ArrivalDepartureEvent } from '@/external/generated/risJourneys';
import type { TransportDestinationPortionWorkingRef } from '@/external/generated/risJourneysV2';
import { getJourneyDetails } from '@/external/risJourneys';
import { calculateCurrentStopPlace } from '@/server/HAFAS/Detail';
import { getStopPlaceByEva } from '@/server/StopPlace/search';
import { getAbfahrten } from '@/server/iris';
import { getLineFromNumber } from '@/server/journeys/lineNumberMapping';
import type { JourneyResponse } from '@/types/journey';
import type { RouteStop } from '@/types/routing';
import type { CommonStopInfo } from '@/types/stopPlace';
import {
	compareDesc,
	differenceInMinutes,
	isAfter,
	isBefore,
	parseISO,
	subHours,
	subMinutes,
} from 'date-fns';

const trainNumberRegex = /(.*?)(\d+).*/;

export async function addIrisMessagesToDetails(
	details: JourneyResponse,
): Promise<void> {
	const irisStop = details.currentStop || details.stops.at(-1);

	if (irisStop) {
		const stopInfo = irisStop.departure || irisStop.arrival;

		if (stopInfo) {
			try {
				const irisData = await getAbfahrten(
					irisStop.station.evaNumber,
					false,
					{
						lookahead: 10,
						lookbehind: 0,
						startTime: subMinutes(stopInfo.scheduledTime, 5),
					},
					true,
				);

				const irisDeparture = irisData.departures.find(
					(a) => a.train.name === details.train.name,
				);

				if (irisDeparture) {
					const irisMessages = [
						...irisDeparture.messages.delay,
						...irisDeparture.messages.qos,
						...irisDeparture.messages.him,
					].sort((m1, m2) => compareDesc(m1.timestamp!, m2.timestamp!));
					irisStop.irisMessages = irisMessages;

					// details.himMessages = irisDeparture.messages.him;
				}
			} catch {
				// ignore
			}
		}
	}
}

export function getCategoryAndNumberFromName(trainName: string):
	| {
			trainNumber: number;
			category?: string;
	  }
	| undefined {
	const regexResult = trainNumberRegex.exec(trainName);
	const trainNumber = Number.parseInt(regexResult?.[2].trim() || '');
	const category = regexResult?.[1]?.trim();

	if (!Number.isNaN(trainNumber)) {
		return {
			trainNumber,
			category: category?.length ? category : undefined,
		};
	}
}

interface StopInfoWithAdditional extends CommonStopInfo {
	additional?: boolean;
	travelsWith?: TransportDestinationPortionWorkingRef[];
}

function mapEventToCommonStopInfo(
	e: ArrivalDepartureEvent,
): StopInfoWithAdditional {
	const scheduledTime = parseISO(e.timeSchedule);
	const time = parseISO(e.time);
	// Delay is undefined for scheduled stuff => no real time Information
	const delay =
		e.timeType === TimeType.Schedule
			? undefined
			: differenceInMinutes(time, scheduledTime, {
					roundingMethod: 'floor',
				});

	return {
		scheduledTime,
		time,
		delay,
		cancelled: e.canceled,
		additional: e.additional,
		scheduledPlatform: e.platformSchedule,
		platform: e.platform,
		isRealTime: e.timeType === 'REAL' || undefined,
		// travelsWith: e.travelsWith,
	};
}

interface JourneyStop extends RouteStop {
	arrival?: StopInfoWithAdditional;
	departure?: StopInfoWithAdditional;
}

function newStopInfoIsAfter(stop: JourneyStop, event: ArrivalDepartureEvent) {
	const timeSchedule = new Date(event.timeSchedule);
	if (
		event.type === EventType.Arrival &&
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

async function stopsFromEvents(
	events: ArrivalDepartureEvent[],
): Promise<JourneyStop[]> {
	const stops: JourneyStop[] = [];
	for (const e of events) {
		const stopInfo = mapEventToCommonStopInfo(e);
		const possibleStops = stops.filter(
			(s) =>
				s.station.evaNumber === e.station.evaNumber && newStopInfoIsAfter(s, e),
		);
		let stop = possibleStops.length ? possibleStops.at(-1) : undefined;

		const stopType = e.type === EventType.Arrival ? 'arrival' : 'departure';
		if (!stop || stop[stopType]) {
			stop = {
				station: {
					evaNumber: e.station.evaNumber,
					name: e.station.name
						.replaceAll('(', ' (')
						.replaceAll(')', ') ')
						.replaceAll('  ', ' ')
						.trim(),
				},
			};
			stops.push(stop);
		}

		stop[stopType] = stopInfo;
	}

	const rl100Promise = Promise.all(
		stops.map(async (s) => {
			try {
				const stopPlace = await getStopPlaceByEva(s.station.evaNumber);
				s.station.ril100 = stopPlace?.ril100;
			} catch {
				// we just ignore errors
			}
		}),
	);

	for (const s of stops) {
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

		// mapTravelsWith to split/join
		if (s.arrival?.travelsWith) {
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

	await rl100Promise;

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
	if (!firstStop || !lastStop) {
		return;
	}

	const operatorNames = [
		...new Set(journey.events.map((e) => e.administration.operatorName)),
	].join(', ');

	const result: JourneyResponse = {
		stops,
		segmentStart: firstStop.station,
		segmentDestination: lastStop.station,
		journeyId: journey.journeyID,
		arrival: lastStop.arrival!,
		departure: firstStop.departure!,
		finalDestination: journey.destinationSchedule.name,
		train: {
			type: firstEvent.transport.category,
			number: firstEvent.transport.number.toString(),
			name: `${firstEvent.transport.category} ${
				firstEvent.transport.line || firstEvent.transport.number
			}`,
			admin: firstEvent.administration.administrationID,
			line: getLineFromNumber(firstEvent.transport.number.toString()),
			transportType: firstEvent.transport.type,
			operator: operatorNames,
		},
		type: 'JNY',
		cancelled: stops.every((s) => s.cancelled) || undefined,
	};

	result.currentStop = calculateCurrentStopPlace(result);

	if (isAfter(result.departure.scheduledTime, subHours(new Date(), 20))) {
		await addIrisMessagesToDetails(result);
	}

	return result;
}
