import { TransportType } from '@/external/types';
import mergeSegments from '@/server/HAFAS/TripSearch/mergeSegments';
import { adjustProductOperator } from '@/server/HAFAS/helper/adjustProductOperator';
import parseAuslastung from '@/server/HAFAS/helper/parseAuslastung';
import parseCommonArrival from '@/server/HAFAS/helper/parseCommonArrival';
import parseCommonDeparture from '@/server/HAFAS/helper/parseCommonDeparture';
import parseDuration from '@/server/HAFAS/helper/parseDuration';
import parseMessages from '@/server/HAFAS/helper/parseMessages';
import parseStop from '@/server/HAFAS/helper/parseStop';
import parseTarif from '@/server/HAFAS/helper/parseTarif';
import { getGroups } from '@/server/StopPlace/search';
import type {
	CommonStop,
	CommonStopInfo,
	HafasResponse,
	ParsedCommon,
} from '@/types/HAFAS';
import type {
	Jny,
	OutConL,
	SecL,
	TripSearchResponse,
} from '@/types/HAFAS/TripSearch';
import type {
	RouteJourney,
	RouteJourneySegment,
	RouteStop,
	RoutingResult,
	SingleRoute,
} from '@/types/routing';
import type { MinimalStopPlace } from '@/types/stopPlace';
import { differenceInMilliseconds, parse } from 'date-fns';

const nameRegex = /O=([^@]+)/;
const evaRegex = /L=(\d+)/;

async function isSameSalesGroup(eva1: string, eva2: string) {
	const [groupsOf1, groupsOf2] = await Promise.all([
		getGroups(eva1),
		getGroups(eva2),
	]);
	return groupsOf1.STATION?.includes(eva2) && groupsOf2.STATION?.includes(eva1);
}

function parseFullStation(fullStation: string): MinimalStopPlace {
	const titleMatch = nameRegex.exec(fullStation);
	const idMatch = evaRegex.exec(fullStation);

	let name = '';
	let evaNumber = '';

	if (titleMatch?.[1]) name = titleMatch[1];
	if (idMatch?.[1]) evaNumber = idMatch[1].padStart(7, '0');

	return {
		name,
		evaNumber,
	};
}

function adjustToFirstTrain(
	departure: CommonStopInfo,
	segments: RouteJourneySegment[],
) {
	if (segments.length && segments[0].type !== 'JNY') {
		const firstTrainSegment = segments.find((s) => s.type === 'JNY');

		if (firstTrainSegment) {
			departure.delay = firstTrainSegment.arrival.delay;
		}
	}
}

function adjustToLastTrain(
	arrival: CommonStopInfo,
	segments: RouteJourneySegment[],
) {
	if (segments.length && segments.at(-1)?.type !== 'JNY') {
		const allTrainSegments = segments.filter((s) => s.type === 'JNY');

		if (allTrainSegments.length) {
			const lastTrainSegment = allTrainSegments.at(-1)!;

			arrival.delay = lastTrainSegment.arrival.delay;
		}
	}
}

const AllowedLegTypes = new Set(['JNY', 'WALK', 'TRSF']);

export class Journey {
	private date: Date;
	constructor(
		private raw: OutConL,
		private common: ParsedCommon,
	) {
		this.date = parse(raw.date, 'yyyyMMdd', new Date());
	}
	parseJourney = async (): Promise<SingleRoute> => {
		const allSegments = (
			await Promise.all(
				this.raw.secL
					.filter((leg) => AllowedLegTypes.has(leg.type))
					.map(this.parseSegment),
			)
		).filter(Boolean);

		const segments = mergeSegments(allSegments);

		const arrival = parseCommonArrival(this.raw.arr, this.date, this.common);
		const departure = parseCommonDeparture(
			this.raw.dep,
			this.date,
			this.common,
		);

		adjustToFirstTrain(departure, segments);
		adjustToLastTrain(arrival, segments);

		return Promise.resolve({
			id: this.raw.cksum,
			cid: this.raw.cid,
			date: this.date,
			duration: parseDuration(this.raw.dur),
			changes: this.raw.chg,
			isRideable: !this.raw.isNotRdbl,
			arrival,
			departure,
			segments,
			segmentTypes: segments
				.map((s) => (s.type === 'JNY' ? s.train.type : s.train.name))
				.filter(Boolean as any),
			tarifSet: parseTarif(this.raw.trfRes),
		});
	};
	private parseStops = (stops: CommonStop[] | undefined): RouteStop[] => {
		if (!stops) return [];

		return stops.map((stop) => parseStop(stop, this.common, this.date));
	};
	private parseSegmentJourney = (jny: Jny): RouteJourney => {
		const [, fullStart, fullDestination, , , , , , ,] = jny.ctxRecon.split('$');
		const product = this.common.prodL[jny.prodX];
		adjustProductOperator(product, this.common, jny.stopL);

		return {
			train: product,
			cancelled: jny.isCncl,
			changeDuration: jny.chgDurR,
			segmentStart: parseFullStation(fullStart),
			segmentDestination: parseFullStation(fullDestination),
			stops: this.parseStops(jny.stopL),
			finalDestination: jny.dirTxt,
			jid: jny.jid,
			auslastung: parseAuslastung(jny.dTrnCmpSX, this.common.tcocL),
			messages: parseMessages(jny.msgL, this.common),
		};
	};
	private parseSegment = async (
		t: SecL,
	): Promise<undefined | RouteJourneySegment> => {
		switch (t.type) {
			case 'JNY': {
				const arrival = parseCommonArrival(t.arr, this.date, this.common);
				const departure = parseCommonDeparture(t.dep, this.date, this.common);

				return {
					arrival,
					departure,
					duration:
						arrival.scheduledTime &&
						departure.scheduledTime &&
						differenceInMilliseconds(
							arrival.scheduledTime,
							departure.scheduledTime,
						),
					wings: t.parJnyL
						? t.parJnyL.map(this.parseSegmentJourney)
						: undefined,
					// reservationStatus: t.resState,
					// reservationRecommandation: t.resRecommendation,
					// icoX: this.common.icoL[t.icoX],
					...this.parseSegmentJourney(t.jny),
					type: 'JNY',
				};
			}
			case 'TRSF':
			case 'WALK': {
				const segmentStart = this.common.locL[t.dep.locX];
				const segmentDestination = this.common.locL[t.arr.locX];

				// same sales group = same Station
				if (
					await isSameSalesGroup(
						segmentStart.evaNumber,
						segmentDestination.evaNumber,
					)
				) {
					return;
				}

				return {
					type: 'WALK',
					train: {
						name: 'Fußweg',
						type: 'Fußweg',
						transportType: TransportType.Walk,
					},
					arrival: parseCommonArrival(t.arr, this.date, this.common),
					departure: parseCommonDeparture(t.dep, this.date, this.common),
					duration: parseDuration(t.gis.durS),
					segmentStart: this.common.locL[t.dep.locX],
					segmentDestination: this.common.locL[t.arr.locX],
				};
			}
			default: {
				return undefined;
			}
		}
	};
}

export default async (
	r: HafasResponse<TripSearchResponse>,
	parsedCommon: ParsedCommon,
): Promise<RoutingResult> => {
	const routes = (
		await Promise.all(
			r.svcResL[0].res.outConL.flatMap((j) =>
				new Journey(j, parsedCommon).parseJourney(),
			),
		)
	).filter((j) => j.segments.length);

	return {
		context: {
			earlier: r.svcResL[0].res.outCtxScrB,
			later: r.svcResL[0].res.outCtxScrF,
		},
		routes,
	};
};
