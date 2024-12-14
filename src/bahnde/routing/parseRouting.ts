import type {
	BahnDEAuslastungsMeldung,
	BahnDEHalt,
	BahnDERISNotiz,
	BahnDERoutingAbschnitt,
	BahnDERoutingResult,
	BahnDERoutingVerbindung,
	BahnDEVerkehrsmittel,
} from '@/bahnde/types';
import { TransportType } from '@/external/types';
import { getStopPlaceByEva } from '@/server/StopPlace/search';
import type {
	CommonStopInfo,
	HafasStation,
	ParsedProduct,
} from '@/types/HAFAS';
import {
	AuslastungsValue,
	type RouteAuslastung,
	type RouteJourneySegment,
	type RouteJourneySegmentTrain,
	type RouteJourneySegmentWalk,
	type RouteStop,
	type RoutingResult,
	type SingleRoute,
} from '@/types/routing';
import { tz } from '@date-fns/tz';
import {
	differenceInMilliseconds,
	differenceInMinutes,
	parseISO,
} from 'date-fns';

const europeBerlin = tz('Europe/Berlin');

const parseTime = (dateTime?: string) => {
	if (dateTime) {
		return parseISO(dateTime, {
			in: europeBerlin,
		});
	}
};

const mapWalkSegmentStartDestination = async (
	input: BahnDERoutingAbschnitt,
	prefix: 'ankunfts' | 'abfahrts',
): Promise<HafasStation> => {
	let evaNumber = input[`${prefix}OrtExtId`];
	if (evaNumber.startsWith('0')) {
		evaNumber = evaNumber.substring(1);
	}
	const risStopPlace = await getStopPlaceByEva(evaNumber);
	if (!risStopPlace) {
		return {
			name: input[`${prefix}Ort`],
			evaNumber,
			// TODO: make this optional
			coordinates: {
				lat: 0,
				lng: 0,
			},
		};
	}
	return {
		coordinates: {
			lat: risStopPlace.position?.latitude || 0,
			lng: risStopPlace.position?.longitude || 0,
		},
		evaNumber,
		name: risStopPlace.name,
		ril100: risStopPlace.ril100,
	};
};

function risAdditional(input?: BahnDERISNotiz[]) {
	return (
		input?.some((n) => n.key === 'text.realtime.stop.additional') || undefined
	);
}

function risCancelled(input?: BahnDERISNotiz[]) {
	return (
		input?.some(
			(n) =>
				n.key === 'text.realtime.stop.cancelled' ||
				n.key === 'text.realtime.connection.cancelled',
		) || undefined
	);
}

function mapSegmentArrival(
	input: BahnDERoutingAbschnitt,
	lastHalt?: CommonStopInfo,
): CommonStopInfo;
function mapSegmentArrival(input: BahnDEHalt): CommonStopInfo | undefined;
function mapSegmentArrival(
	input: BahnDERoutingAbschnitt | BahnDEHalt,
	lastHalt?: CommonStopInfo,
): CommonStopInfo | undefined {
	const scheduledTime = parseTime(input.ankunftsZeitpunkt);
	const time = parseTime(input.ezAnkunftsZeitpunkt || input.ankunftsZeitpunkt);
	if (!scheduledTime || !time) {
		return undefined;
	}
	const delay = input.ezAnkunftsZeitpunkt
		? differenceInMinutes(time, scheduledTime)
		: undefined;
	let platform: string | undefined = undefined;
	let scheduledPlatform: string | undefined = undefined;

	if ('gleis' in input) {
		scheduledPlatform = input.gleis;
		platform = input.gleis;
	}
	if ('ezGleis' in input) {
		platform = input.ezGleis;
	}

	return {
		time,
		scheduledTime,
		delay: delay != null ? delay : undefined,
		cancelled: risCancelled(input.risNotizen),
		additional: risAdditional(input.risNotizen),
		platform: platform || lastHalt?.platform,
		scheduledPlatform: scheduledPlatform || lastHalt?.scheduledPlatform,
	};
}

function mapSegmentDeparture(
	input: BahnDERoutingAbschnitt,
	firstHalt?: CommonStopInfo,
): CommonStopInfo;
function mapSegmentDeparture(input: BahnDEHalt): CommonStopInfo | undefined;
function mapSegmentDeparture(
	input: BahnDERoutingAbschnitt | BahnDEHalt,
	firstHalt?: CommonStopInfo,
): CommonStopInfo | undefined {
	const scheduledTime = parseTime(input.abfahrtsZeitpunkt);
	const time = parseTime(input.ezAbfahrtsZeitpunkt || input.abfahrtsZeitpunkt);
	if (!scheduledTime || !time) {
		return undefined;
	}
	const delay = input.ezAbfahrtsZeitpunkt
		? differenceInMinutes(time, scheduledTime)
		: undefined;
	let platform: string | undefined = undefined;
	let scheduledPlatform: string | undefined = undefined;
	if ('gleis' in input) {
		scheduledPlatform = input.gleis;
		platform = input.gleis;
	}
	if ('ezGleis' in input) {
		platform = input.ezGleis;
	}

	return {
		time,
		scheduledTime,
		delay: delay != null ? delay : undefined,
		cancelled: risCancelled(input.risNotizen),
		platform: platform || firstHalt?.platform,
		scheduledPlatform: scheduledPlatform || firstHalt?.scheduledPlatform,
	};
}

const mapProduct = (input: BahnDEVerkehrsmittel): ParsedProduct => {
	return {
		name: input.langText || input.mittelText || input.name,
		line: input.linienNummer,
		// TODO:
		transportType: TransportType.Unknown,
		number: input.nummer === input.linienNummer ? '0' : input.nummer,
		type: input.kurzText || input.kategorie,
		operator: {
			name: input.zugattribute?.filter((a) => a.key === 'BEF').join(', '),
		},
	};
};

const mapSingleAuslastung = (input?: number): AuslastungsValue | undefined => {
	switch (input) {
		case 1:
			return AuslastungsValue.Gering;
		case 2:
			return AuslastungsValue.Hoch;
		case 3:
			return AuslastungsValue.SehrHoch;
		case 4:
		case 99:
			return AuslastungsValue.Ausgebucht;
	}
};
const mapAuslastung = (
	input?: BahnDEAuslastungsMeldung[],
): RouteAuslastung | undefined => {
	const firstClassAuslastung = input?.find((i) => i.klasse === 'KLASSE_1');
	const secondClassAuslastung = input?.find((i) => i.klasse === 'KLASSE_2');
	if (firstClassAuslastung || secondClassAuslastung) {
		return {
			first: mapSingleAuslastung(firstClassAuslastung?.stufe),
			second: mapSingleAuslastung(secondClassAuslastung?.stufe),
		};
	}
};

const mapHalt = async (input: BahnDEHalt): Promise<RouteStop> => {
	const stopPlace = await getStopPlaceByEva(input.extId);
	const hafasStopPlace: RouteStop['station'] = {
		evaNumber: input.extId,
		name: input.name,
	};
	return {
		station: stopPlace ?? hafasStopPlace,
		arrival: mapSegmentArrival(input),
		departure: mapSegmentDeparture(input),
		auslastung: mapAuslastung(input.auslastungsmeldungen),
		cancelled: risCancelled(input.risNotizen),
		additional: risAdditional(input.risNotizen),
	};
};

const mapJourneySegment = async (
	input: BahnDERoutingAbschnitt,
): Promise<RouteJourneySegmentTrain | undefined> => {
	const product = mapProduct(input.verkehrsmittel);
	const segmentStart = (await getStopPlaceByEva(input.abfahrtsOrtExtId)) ?? {
		evaNumber: input.abfahrtsOrtExtId,
		name: input.abfahrtsOrt,
	};
	const segmentDestination = (await getStopPlaceByEva(
		input.ankunftsOrtExtId,
	)) ?? {
		evaNumber: input.ankunftsOrtExtId,
		name: input.ankunftsOrt,
	};

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
): Promise<RoutingResult> => ({
	context: input.verbindungReference,
	routes: await Promise.all(input.verbindungen.map(mapVerbindung)),
});
