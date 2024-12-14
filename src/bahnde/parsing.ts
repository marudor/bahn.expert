import type {
	BahnDEAuslastungsMeldung,
	BahnDEHalt,
	BahnDERISNotiz,
	BahnDERoutingAbschnitt,
} from '@/bahnde/types';
import { getStopPlaceByEva } from '@/server/StopPlace/search';
import type { CommonStopInfo } from '@/types/HAFAS';
import {
	AuslastungsValue,
	type RouteAuslastung,
	type RouteStop,
} from '@/types/routing';
import { tz } from '@date-fns/tz';
import { differenceInMinutes, parseISO } from 'date-fns';

const europeBerlin = tz('Europe/Berlin');

const parseTime = (dateTime?: string) => {
	if (dateTime) {
		return parseISO(dateTime, {
			in: europeBerlin,
		});
	}
};

export function mapSegmentArrival(
	input: BahnDERoutingAbschnitt,
	lastHalt?: CommonStopInfo,
): CommonStopInfo;
export function mapSegmentArrival(
	input: BahnDEHalt,
): CommonStopInfo | undefined;
export function mapSegmentArrival(
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

export function risAdditional(input?: BahnDERISNotiz[]) {
	return (
		input?.some((n) => n.key === 'text.realtime.stop.additional') || undefined
	);
}

export function risCancelled(input?: BahnDERISNotiz[]) {
	return (
		input?.some(
			(n) =>
				n.key === 'text.realtime.stop.cancelled' ||
				n.key === 'text.realtime.connection.cancelled',
		) || undefined
	);
}

export function mapSegmentDeparture(
	input: BahnDERoutingAbschnitt,
	firstHalt?: CommonStopInfo,
): CommonStopInfo;
export function mapSegmentDeparture(
	input: BahnDEHalt,
): CommonStopInfo | undefined;
export function mapSegmentDeparture(
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

export const mapHalt = async (input: BahnDEHalt): Promise<RouteStop> => {
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

export const mapAuslastung = (
	input?: BahnDEAuslastungsMeldung[],
): RouteAuslastung | undefined => {
	const firstClassAuslastung = mapSingleAuslastung(
		input?.find((i) => i.klasse === 'KLASSE_1')?.stufe,
	);
	const secondClassAuslastung = mapSingleAuslastung(
		input?.find((i) => i.klasse === 'KLASSE_2')?.stufe,
	);
	if (firstClassAuslastung || secondClassAuslastung) {
		return {
			first: firstClassAuslastung,
			second: secondClassAuslastung,
		};
	}
};
