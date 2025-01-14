import {
	mapAuslastung,
	mapHalt,
	mapSegmentArrival,
	mapSegmentDeparture,
	risCancelled,
} from '@/bahnde/parsing';
import type {
	BahnDERoutingAbschnitt,
	BahnDERoutingResult,
	BahnDERoutingVerbindung,
	BahnDEVerkehrsmittel,
} from '@/bahnde/types';
import { TransportType } from '@/external/types';
import { getStopPlaceByEva } from '@/server/StopPlace/search';
import type { CommonProductInfo } from '@/types/journey';
import type {
	RouteJourneySegment,
	RouteJourneySegmentTrain,
	RouteJourneySegmentWalk,
	RoutingResult,
	RoutingStopPlace,
	SingleRoute,
} from '@/types/routing';
import { differenceInMilliseconds, differenceInMinutes } from 'date-fns';

const mapWalkSegmentStartDestination = async (
	input: BahnDERoutingAbschnitt,
	prefix: 'ankunfts' | 'abfahrts',
): Promise<RoutingStopPlace> => {
	let evaNumber = input[`${prefix}OrtExtId`];
	if (evaNumber.startsWith('0')) {
		evaNumber = evaNumber.substring(1);
	}
	const risStopPlace = await getStopPlaceByEva(evaNumber);
	if (!risStopPlace) {
		return {
			name: input[`${prefix}Ort`],
			evaNumber,
		};
	}
	return {
		position: risStopPlace.position,
		evaNumber,
		name: risStopPlace.name,
		ril100: risStopPlace.ril100,
	};
};

const mapProduct = (input: BahnDEVerkehrsmittel): CommonProductInfo => {
	return {
		name: input.langText || input.mittelText || input.name,
		line: input.linienNummer,
		// TODO:
		transportType: TransportType.Unknown,
		number: input.nummer === input.linienNummer ? '0' : input.nummer,
		type: input.kurzText || input.kategorie,
		operator: input.zugattribute?.filter((a) => a.key === 'BEF').join(', '),
	};
};

function normalizeStopPlaceName(name: string) {
	return name.replace('(', ' (').replace(')', ') ').trim();
}

const mapJourneySegment = async (
	input: BahnDERoutingAbschnitt,
): Promise<RouteJourneySegmentTrain | undefined> => {
	const product = mapProduct(input.verkehrsmittel);
	const segmentStart = (await getStopPlaceByEva(input.abfahrtsOrtExtId)) ?? {
		evaNumber: input.abfahrtsOrtExtId,
		name: input.abfahrtsOrt,
	};
	segmentStart.name = normalizeStopPlaceName(segmentStart.name);
	const segmentDestination = (await getStopPlaceByEva(
		input.ankunftsOrtExtId,
	)) ?? {
		evaNumber: input.ankunftsOrtExtId,
		name: input.ankunftsOrt,
	};
	segmentDestination.name = normalizeStopPlaceName(segmentDestination.name);

	const stops = await Promise.all(input.halte?.map(mapHalt) || []);

	const arrival = mapSegmentArrival(input, stops.at(-1)?.arrival!);
	const departure = mapSegmentDeparture(input, stops.at(0)?.departure!);

	if (!arrival || !departure) {
		return undefined;
	}

	return {
		type: 'JNY',
		arrival,
		departure,
		duration:
			arrival.scheduledTime &&
			departure.scheduledTime &&
			differenceInMilliseconds(arrival.scheduledTime, departure.scheduledTime),
		// TODO wings
		wings: undefined,
		finalDestination: input.verkehrsmittel.richtung,
		segmentStart,
		segmentDestination,
		auslastung: mapAuslastung(input.auslastungsmeldungen),
		cancelled: risCancelled(input.risNotizen),
		stops,
		train: product,
		jid: input.journeyId,
	};
};

const mapWalkSegment = async (
	input: BahnDERoutingAbschnitt,
): Promise<RouteJourneySegmentWalk> => ({
	type: 'WALK',
	arrival: mapSegmentArrival(input),
	departure: mapSegmentDeparture(input),
	duration: (input.ezAbschnittsDauerInSeconds || input.abschnittsDauer) * 1000,
	segmentStart: await mapWalkSegmentStartDestination(input, 'abfahrts'),
	segmentDestination: await mapWalkSegmentStartDestination(input, 'ankunfts'),
	train: {
		name: 'Fußweg',
		type: 'Fußweg',
		transportType: TransportType.Walk,
	},
});

const mapSegment = async (
	input: BahnDERoutingAbschnitt,
): Promise<RouteJourneySegment | undefined> => {
	// TRSF is educated guess
	if (
		input.verkehrsmittel.typ === 'WALK' ||
		input.verkehrsmittel.typ === 'TRSF'
	) {
		return mapWalkSegment(input);
	}
	return mapJourneySegment(input);
};

const mapVerbindung = async (
	input: BahnDERoutingVerbindung,
	index: number,
): Promise<SingleRoute> => {
	const segments = (
		await Promise.all(input.verbindungsAbschnitte.map(mapSegment))
	).filter(Boolean);
	for (let i = 1; i < segments.length; i += 1) {
		const prevSegment = segments[i - 1];
		const nextSegment = segments[i];
		if (prevSegment.type === 'JNY' && nextSegment.type === 'JNY') {
			prevSegment.changeDuration = differenceInMinutes(
				nextSegment.departure.time,
				prevSegment.arrival.time,
			);
		}
	}

	const firstJny = segments.find((s) => s.type === 'JNY')!;
	const lastJny = segments.findLast((s) => s.type === 'JNY')!;

	return {
		id: input.tripId,
		cid: index.toString(),
		changes: input.umstiegsAnzahl,
		duration:
			(input.ezVerbindungsDauerInSeconds || input.verbindungsDauerInSeconds) *
			1000,
		date: firstJny.arrival.time,
		isRideable: !risCancelled(input.risNotizen),
		segmentTypes: segments
			.map((s) => (s.type === 'JNY' ? s.train.type : s.train.name))
			.filter(Boolean),
		segments,
		arrival: lastJny.arrival,
		departure: firstJny.departure,
	};
};

export const parseBahnRouting = async (
	input: BahnDERoutingResult,
): Promise<RoutingResult> => {
	try {
		return {
			context: input.verbindungReference,
			routes: await Promise.all(input.verbindungen.map(mapVerbindung)),
		};
	} catch {
		throw new Error('NOT_FOUND');
	}
};
