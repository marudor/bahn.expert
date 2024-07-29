/*
 ** This algorithm is heavily inspired by https://github.com/derf/Travel-Status-DE-IRIS
 ** derf did awesome work reverse engineering the XML stuff!
 */
import { uniqBy } from '@/client/util';
import { getSingleHimMessageOfToday } from '@/server/HAFAS/HimSearch';
import { getStopPlaceByEva } from '@/server/StopPlace/search';
import { Cache, CacheDatabase } from '@/server/cache';
import { getSingleStation } from '@/server/iris/station';
import { getLineFromNumber } from '@/server/journeys/lineNumberMapping';
import type {
	AbfahrtenResult,
	HimIrisMessage,
	IrisMessage,
	IrisMessages,
	Stop,
	SubstituteRef,
} from '@/types/iris';
import Axios from 'axios';
import {
	addHours,
	addMinutes,
	compareAsc,
	compareDesc,
	format,
	isAfter,
	isBefore,
	parse,
	subHours,
	subMinutes,
} from 'date-fns';
import { diffArrays } from 'diff';
import xmljs from 'libxmljs2';
import type { Element } from 'libxmljs2';
import {
	calculateVia,
	getAttr,
	getNumberAttr,
	getTsOfNode,
	irisGetRequest,
	parseTs,
} from './helper';
import {
	ignoredMessageNumbers,
	messageTypeLookup,
	messages,
	supersededMessages,
} from './messageLookup';

interface ArDp {
	platform?: string;
	status?: string;
}

type ParsedDp = ArDp & {
	departureTs?: string;
	scheduledDepartureTs?: string;
	routePost?: string[];
	plannedRoutePost?: string[];
};

type ParsedAr = ArDp & {
	arrivalTs?: string;
	scheduledArrivalTs?: string;
	routePre?: string[];
	plannedRoutePre?: string[];
};

const timetableCache = new Cache<{
	timetable: Record<string, any>;
	wingIds: Record<string, string>;
}>(CacheDatabase.TimetableParsedWithWings);

interface Route {
	name: string;
	cancelled?: boolean;
	additional?: boolean;
}

export interface TimetableOptions {
	lookahead: number;
	lookbehind: number;
	startTime?: Date;
	/**
	 * This skips some time consuming calculations
	 */
	sloppy?: boolean;
}

const processRawRouteString = (rawRouteString?: string) =>
	rawRouteString?.split('|').filter(Boolean).map(normalizeRouteName);
const routeMap: (s: string) => Route = (name) => ({ name });
const normalizeRouteName = (name: string) =>
	name.replace('(', ' (').replace(')', ') ').trim();
const deNormalizeRouteName = (name: string) =>
	name.replace(' (', '(').replace(') ', ')');

const UnbekannteBetriebsstelleRegex = /Betriebsstelle nicht bekannt (\d{6,7})/;

async function resolveUnknownStopPlace(rawStopPlaceName: string) {
	try {
		const regexResult = UnbekannteBetriebsstelleRegex.exec(rawStopPlaceName);
		if (regexResult) {
			const eva = regexResult[1];
			const realStopPlace = await getStopPlaceByEva(eva);
			if (realStopPlace) {
				return realStopPlace.name;
			}
		}
	} catch {
		// we do nothing
	}
	return rawStopPlaceName;
}

export function parseRealtimeDp(
	dp: null | xmljs.Element,
): undefined | ParsedDp {
	if (!dp) return undefined;

	return {
		departureTs: getAttr(dp, 'ct'),
		scheduledDepartureTs: getAttr(dp, 'pt'),
		platform: getAttr(dp, 'cp'),
		routePost: processRawRouteString(getAttr(dp, 'cpth')),
		plannedRoutePost: processRawRouteString(getAttr(dp, 'ppth')),
		status: getAttr(dp, 'cs'),
	};
}

export function parseRealtimeAr(
	ar: null | xmljs.Element,
): undefined | ParsedAr {
	if (!ar) return undefined;

	return {
		arrivalTs: getAttr(ar, 'ct'),
		scheduledArrivalTs: getAttr(ar, 'pt'),
		platform: getAttr(ar, 'cp'),
		routePre: processRawRouteString(getAttr(ar, 'cpth')),
		plannedRoutePre: processRawRouteString(getAttr(ar, 'ppth')),
		status: getAttr(ar, 'cs'),
		// statusSince: getAttr(ar, 'clt'),
	};
}

function parseTl(tl: xmljs.Element): {
	productClass?: string;
	o?: string;
	t?: string;
	number: string;
	category: string;
} {
	return {
		// D = Irregular, like third party
		// N = Nahverkehr
		// S = Sbahn
		// F = Fernverkehr
		productClass: getAttr(tl, 'f'),
		o: getAttr(tl, 'o'),
		t: getAttr(tl, 't'),
		number: getAttr(tl, 'n') || '',
		category: getAttr(tl, 'c') || '',
	};
}

const idRegex = /-?(\w+)/;
const mediumIdRegex = /-?(\w+-\w+)/;
const initialDepartureRegex = /-?\w+-(\w+)/;

function parseRawId(rawId: string) {
	const idMatch = idRegex.exec(rawId);
	const mediumIdMatch = mediumIdRegex.exec(rawId);
	const initialDepartureMatch = initialDepartureRegex.exec(rawId);

	return {
		id: idMatch?.[1] || rawId,
		mediumId: mediumIdMatch?.[1] || rawId,
		initialDeparture: initialDepartureMatch?.[1]
			? parse(initialDepartureMatch[1], 'yyMMddHHmm', Date.now())
			: undefined,
	};
}

export class Timetable {
	errors: any[] = [];
	timetable: Record<string, any> = {};
	realtimeIds: string[] = [];
	segments: Date[];
	currentStopPlaceName: string;
	wingIds: Record<string, string> = {};
	startTime: Date;
	maxDate: Date;
	minDate: Date;
	sloppy?: boolean;

	constructor(
		private evaNumber: string,
		currentStopPlaceName: string,
		options: TimetableOptions,
	) {
		this.startTime = options.startTime || new Date();
		this.maxDate = addMinutes(this.startTime, options.lookahead);
		this.minDate = subMinutes(this.startTime, options.lookbehind);
		this.segments = [this.startTime];
		for (let i = 1; i <= Math.ceil(options.lookahead / 60); i += 1) {
			this.segments.push(addHours(this.startTime, i));
		}
		for (let i = 1; i <= Math.ceil((options.lookbehind || 1) / 60); i += 1) {
			this.segments.push(subHours(this.startTime, i));
		}
		this.currentStopPlaceName = normalizeRouteName(currentStopPlaceName);
		this.sloppy = options.sloppy;
	}
	async computeExtra(abfahrt: any) {
		delete abfahrt.rawRoute;
		if (this.sloppy) {
			return;
		}

		abfahrt.cancelled =
			(abfahrt.arrival?.cancelled &&
				(!abfahrt.departure ||
					abfahrt.departure.cancelled ||
					!abfahrt.departure.scheduledTime)) ||
			(abfahrt.departure?.cancelled && !abfahrt.arrival?.scheduledTime);

		abfahrt.messages.him = abfahrt.messages.him.filter((m: any) => m.text);

		const currentRoutePart = {
			name: abfahrt.currentStopPlace.name,
			cancelled: abfahrt.cancelled,
			additional: abfahrt.additional,
		};

		abfahrt.route = [
			...abfahrt.routePre,
			currentRoutePart,
			...abfahrt.routePost,
		];

		await Promise.all(
			abfahrt.route.map(async (routeStop: Stop) => {
				routeStop.name = await resolveUnknownStopPlace(routeStop.name);
			}),
		);
		abfahrt.scheduledDestination = await resolveUnknownStopPlace(
			abfahrt.scheduledDestination,
		);

		const nonCancelled = abfahrt.route.filter((r: any) => !r.cancelled);
		const last = nonCancelled.length ? nonCancelled.at(-1) : undefined;

		abfahrt.destination = last?.name || abfahrt.scheduledDestination;
		calculateVia(abfahrt.routePost);

		if (abfahrt.departure) {
			abfahrt.platform = abfahrt.departure.platform;
			abfahrt.scheduledPlatform = abfahrt.departure.scheduledPlatform;
		} else if (abfahrt.arrival) {
			abfahrt.platform = abfahrt.arrival.platform;
			abfahrt.scheduledPlatform = abfahrt.arrival.scheduledPlatform;
		}

		delete abfahrt.routePre;
		delete abfahrt.routePost;
		if (abfahrt.arrival) {
			delete abfahrt.arrival.additional;
		}
		if (abfahrt.departure) {
			delete abfahrt.departure.additional;
		}

		try {
			const firstStop = abfahrt.route[0];
			const stopOfFirst = await getSingleStation(
				deNormalizeRouteName(firstStop.name),
			);
			abfahrt.initialStopPlace = stopOfFirst.eva;
		} catch {
			// failed to fetch initialStopPlace we ignore that in that case
		}

		if (abfahrt.substitute && abfahrt.ref) {
			const substitute = Object.values(this.timetable).find(
				(a) => a.train.number === abfahrt.ref.number,
			);

			if (substitute) {
				substitute.substituted = true;
				substitute.ref = {
					number: abfahrt.train.number,
					type: abfahrt.train.type,
					name: abfahrt.train.name,
				};
			}
		}
	}
	async start(): Promise<AbfahrtenResult> {
		await this.getTimetables();
		await this.getRealtime();

		for (const t of Object.values(this.timetable)) {
			this.transition(t);
		}

		const timetables: any[] = Object.values(this.timetable);

		const filtered = timetables.filter(
			(t) => !this.realtimeIds.includes(t.rawId),
		);

		for (const t of filtered) {
			t.messages = {
				qos: [],
				delay: [],
				him: [],
			};
		}

		const wings: Record<string, any> = {};

		const departures = [] as any[];
		const lookbehind = [] as any[];

		const computePromises = uniqBy(timetables, 'rawId').map(async (a: any) => {
			const referenceWingId = this.wingIds[a.mediumId];

			if (referenceWingId) {
				const referenceTrain = this.timetable[referenceWingId];

				if (
					referenceTrain &&
					(referenceTrain.arrival?.scheduledTime.getTime() ===
						a.arrival?.scheduledTime.getTime() ||
						referenceTrain.departure?.scheduledTime.getTime() ===
							a.departure?.scheduledTime.getTime())
				) {
					wings[a.mediumId] = a;
					return this.computeExtra(a);
				}
			}

			const scheduledArrvial = a.arrival?.scheduledTime;
			const arrival = a.arrival?.time;
			const scheduledDeparture = a.departure?.scheduledTime;
			const departure = a.departure?.time;
			const time: Date = a.departure?.cancelled
				? scheduledArrvial || scheduledDeparture
				: scheduledDeparture || scheduledArrvial;

			const realTime = a.departure?.cancelled
				? arrival || departure
				: departure || arrival;

			if (isAfter(realTime, this.minDate) && isBefore(time, this.maxDate)) {
				if (isBefore(realTime, this.startTime)) {
					lookbehind.push(a);
				} else {
					departures.push(a);
				}
			}
			return this.computeExtra(a);
		});

		await Promise.all(computePromises);

		return {
			departures,
			lookbehind,
			wings,
			stopPlaces: [this.evaNumber],
		};
	}
	/**
	 * Durchbindungen, Züge ädern ihre Kategorie/Nummer und sind eigene Einträge hier. Hier mergen wir das ganze und schreiben prev/next dran
	 */
	// Hier kommt vermutlich eine Abfahrt rein, danke past marudor für fehlende Typen
	transition(a: any): void {
		// Wir nehmen nur abfahrende Züge, suchen den vorherigen, mergen es in den neuen und schmeißen den vorherigen raus.
		if (!a.departure?.transition) {
			return;
		}
		const previous = this.timetable[a.departure.transition];
		if (!previous) {
			return;
		}
		// Weiterfahrt mit gleicher Zugnummer (Kategoriewechsel z.B.)
		if (a.train.number === previous.train.number) {
			a.arrival = previous.arrival;
			a.previousTrain = previous.train;
			a.routePre = previous.routePre;
			delete this.timetable[previous.rawId];
		}
		// TODO: Scheiß Ringbahn
	}
	parseRef(tl: xmljs.Element): SubstituteRef {
		const { category, number } = parseTl(tl);
		const name = `${category} ${number}`;

		return {
			type: category,
			number,
			name,
		};
	}
	async parseHafasMessage(
		mNode: xmljs.Element,
		viaNames: string[],
		seenHafasNotes: Set<string>,
	) {
		const id = getAttr(mNode, 'id');

		if (!id) return undefined;

		const himMessage = await getSingleHimMessageOfToday(id.slice(1));

		if (!himMessage) return undefined;
		// Sadly this is not accurate. Often affected Products is not corectly set
		// if (!himMessage.affectedProducts.some((p) => p.name.endsWith(trainNumber)))
		//   return undefined;
		const now = new Date();

		if (
			isBefore(now, himMessage.startTime) ||
			isAfter(now, himMessage.endTime)
		) {
			return undefined;
		}

		const message: HimIrisMessage = {
			timestamp: getTsOfNode(mNode),
			head: himMessage.head,
			text: himMessage.text,
			// short: himMessage.lead === himMessage.text ? undefined : himMessage.lead,
			source: himMessage.comp,
			// @ts-expect-error raw only in dev
			raw: process.env.NODE_ENV === 'production' ? undefined : himMessage,
		};

		if (himMessage.fromStopPlace && himMessage.toStopPlace) {
			const fromIndex = viaNames.indexOf(himMessage.fromStopPlace.name);
			const toIndex = viaNames.indexOf(himMessage.toStopPlace.name);
			if (fromIndex !== -1 && toIndex !== -1) {
				const from =
					fromIndex < toIndex
						? himMessage.fromStopPlace.name
						: himMessage.toStopPlace.name;
				const to =
					fromIndex > toIndex
						? himMessage.fromStopPlace.name
						: himMessage.toStopPlace.name;

				let stopPlaceInfo = from;
				if (from !== to) {
					stopPlaceInfo += ` - ${to}`;
				}
				message.stopPlaceInfo = stopPlaceInfo;
			}
		}

		const hafasMessageKey = message.text + message.stopPlaceInfo;
		if (seenHafasNotes.has(hafasMessageKey)) {
			return undefined;
		}
		seenHafasNotes.add(hafasMessageKey);

		return {
			type: 'him',
			value: id,
			message,
		};
	}
	async parseMessage(
		mNode: xmljs.Element,
		viaNames: string[],
		seenHafasNotes: Set<string>,
	) {
		const value = getNumberAttr(mNode, 'c');
		const indexType = getAttr(mNode, 't');

		if (!indexType) return undefined;
		if (indexType === 'h') {
			const message = await this.parseHafasMessage(
				mNode,
				viaNames,
				seenHafasNotes,
			);
			return message;
		}
		const type: undefined | string =
			messageTypeLookup[indexType as keyof typeof messageTypeLookup];

		if (
			!type ||
			!value ||
			value <= 1 ||
			ignoredMessageNumbers.includes(value)
		) {
			return undefined;
		}

		// @ts-expect-error ???
		const lookedUpMessage = messages[value];

		// Freitext, nicht auflösbar
		if (!lookedUpMessage && indexType === 'f') {
			return undefined;
		}

		const message: IrisMessage = {
			superseded: undefined,
			text: lookedUpMessage || `${value} (?)`,
			timestamp: getTsOfNode(mNode)!,
			priority: getAttr(mNode, 'pr'),
			value,
		};

		return {
			type,
			value,
			message,
		};
	}
	async parseRealtimeS(sNode: xmljs.Element) {
		const rawId = getAttr(sNode, 'id');

		if (!rawId) return;
		const { id, mediumId, initialDeparture } = parseRawId(rawId);
		const tl = sNode.get('tl');
		const ref = sNode.get<Element>('ref/tl');

		if (!this.timetable[rawId] && tl) {
			const timetable = this.parseTimetableS(sNode, this.wingIds);

			if (timetable) {
				timetable.additional = !timetable.substitute;
				this.timetable[rawId] = timetable;
			}
		}

		if (!this.timetable[rawId]) {
			return;
		}

		const ar = sNode.get<Element>('ar');
		const dp = sNode.get<Element>('dp');
		const mArr: xmljs.Element[] = sNode.find(`${sNode.path()}//m`);

		if (!mArr) return;
		const messages: Record<string, Record<string, any>> = {
			delay: {},
			qos: {},
			him: {},
		};

		const seenHafasNotes = new Set<string>();
		const parsedMessages = await Promise.all(
			mArr.map((m) =>
				this.parseMessage(m, this.timetable[rawId].rawRoute, seenHafasNotes),
			),
		);

		for (const { type, message, value } of parsedMessages
			.filter(Boolean)
			.sort((a, b) =>
				compareAsc(a.message.timestamp || 0, b.message.timestamp || 0),
			)) {
			const supersedes = supersededMessages[value];

			if (!messages[type]) messages[type] = {};
			if (supersedes) {
				for (const v of supersedes) {
					if (messages[type][v]) {
						messages[type][v].superseded = true;
					}
				}
			}
			messages[type][value] = message;
		}

		return {
			id,
			mediumId,
			rawId,
			initialDeparture,
			messages: Object.keys(messages).reduce((agg, messageKey) => {
				const messageValues = Object.values(messages[messageKey]);

				// @ts-expect-error ???
				agg[messageKey] = messageValues.sort((a, b) =>
					compareDesc(a.timestamp, b.timestamp),
				);

				return agg;
			}, {} as IrisMessages),
			arrival: parseRealtimeAr(ar),
			departure: parseRealtimeDp(dp),
			ref: ref ? this.parseRef(ref) : undefined,
		};
	}
	addArrivalInfo(timetable: any, ar: undefined | ParsedAr) {
		if (!ar) return;
		if (!timetable.arrival) timetable.arrival = {};
		timetable.arrival.cancelled = ar.status === 'c';
		timetable.arrival.additional = ar.status === 'a';
		if (ar.scheduledArrivalTs) {
			timetable.arrival.scheduledTime = parseTs(ar.scheduledArrivalTs);
			timetable.arrival.time = timetable.arrival.scheduledTime;
		}
		if (ar.arrivalTs) {
			timetable.arrival.time = parseTs(ar.arrivalTs);
		}
		timetable.arrival.delay =
			(timetable.arrival.time - timetable.arrival.scheduledTime) / 60 / 1000;
		if (ar.routePre) {
			const diff = diffArrays(
				ar.routePre,
				ar.plannedRoutePre || timetable.routePre.map((r: any) => r.name),
			);

			timetable.routePre = diff.flatMap((d) =>
				d.value.map((v) => ({
					name: v,
					additional: d.removed,
					cancelled: d.added,
				})),
			);
		}
		timetable.arrival.platform =
			ar.platform || timetable.arrival.scheduledPlatform;
	}
	addDepartureInfo(timetable: any, dp: undefined | ParsedDp) {
		if (!dp) return;
		if (!timetable.departure) timetable.departure = {};
		timetable.departure.cancelled = dp.status === 'c';
		timetable.departure.additional = dp.status === 'a';
		if (dp.scheduledDepartureTs) {
			timetable.departure.scheduledTime = parseTs(dp.scheduledDepartureTs);
			timetable.departure.time = timetable.departure.scheduledTime;
		}
		if (dp.departureTs) {
			timetable.departure.time = parseTs(dp.departureTs);
		}
		timetable.departure.delay =
			(timetable.departure.time - timetable.departure.scheduledTime) /
			60 /
			1000;
		if (dp.routePost) {
			const diff = diffArrays(
				dp.plannedRoutePost || timetable.routePost.map((r: any) => r.name),
				dp.routePost,
			);

			timetable.routePost = diff.flatMap((d) =>
				d.value.map((v) => ({
					name: v,
					additional: d.added,
					cancelled: d.removed,
				})),
			);
		} else if (timetable.departure.cancelled && timetable.routePost) {
			for (const r of timetable.routePost) {
				r.cancelled = true;
			}
		}
		timetable.departure.platform =
			dp.platform || timetable.departure.scheduledPlatform;
	}
	async fetchRealtime() {
		const url = `/fchg/${this.evaNumber}`;

		try {
			const result = await irisGetRequest<string>(url);

			if (result.includes('<soapenv:Reason')) {
				throw result;
			}

			return result;
		} catch (error) {
			// FCHG sometimes returns 400 instead of 404 if nothing is found?
			if (Axios.isAxiosError(error) && error.response?.status === 400) {
				return null;
			}
			throw error;
		}
	}
	async getRealtime() {
		const rawXml = await this.fetchRealtime();
		if (!rawXml) {
			return null;
		}
		const realtimeXml = xmljs.parseXml(rawXml);
		const sArr = realtimeXml.find<Element>('/timetable/s');

		if (!sArr) return;

		await Promise.allSettled(
			sArr.map(async (s) => {
				const realtime = await this.parseRealtimeS(s);

				if (!realtime) return;
				const timetable = this.timetable[realtime.rawId];

				if (!timetable) return;
				this.realtimeIds.push(realtime.rawId);
				this.addArrivalInfo(timetable, realtime.arrival);
				this.addDepartureInfo(timetable, realtime.departure);
				timetable.messages = realtime.messages;
				timetable.ref = realtime.ref;
			}),
		);
	}
	getWings(
		node: null | xmljs.Element,
		displayAsWing: boolean,
		referenceTrainRawId: string,
		wingIds: Record<string, string>,
	) {
		const wingAttr = getAttr(node, 'wings');

		if (!wingAttr) return;
		const rawWings = wingAttr.split('|');

		const mediumWings = rawWings.map<string>((w) => parseRawId(w).mediumId);

		if (displayAsWing) {
			for (const i of mediumWings) {
				wingIds[i] = referenceTrainRawId;
			}
		}

		return mediumWings;
	}
	parseTimetableS(sNode: xmljs.Element, wingIds: Record<string, string>) {
		const rawId = getAttr(sNode, 'id');

		if (!rawId) {
			return undefined;
		}
		const { id, mediumId, initialDeparture } = parseRawId(rawId);
		const tl = sNode.get<Element>('tl');

		if (!tl) {
			return undefined;
		}
		const ar = sNode.get<Element>('ar');
		const dp = sNode.get<Element>('dp');

		const scheduledArrival = parseTs(getAttr(ar, 'pt'));
		const scheduledDeparture = parseTs(getAttr(dp, 'pt'));
		const { number, category, t, o, productClass } = parseTl(tl);
		const timetableLineNumber = getAttr(dp || ar, 'l');
		const customLineNumber = getLineFromNumber(number);
		const fullTrainText = `${category} ${timetableLineNumber || number}`;

		function getNormalizedRoute(node: null | xmljs.Element) {
			const rawRoute = getAttr(node, 'ppth');

			return (rawRoute ? rawRoute.split('|') : []).map(normalizeRouteName);
		}

		const routePost = getNormalizedRoute(dp);
		const routePre = getNormalizedRoute(ar);

		return {
			o,
			initialDeparture,
			arrival: scheduledArrival && {
				scheduledTime: scheduledArrival,
				time: scheduledArrival,
				wingIds: this.getWings(ar, false, rawId, wingIds),
				platform: getAttr(ar, 'pp'),
				scheduledPlatform: getAttr(ar, 'pp'),
				hidden: Boolean(getAttr(ar, 'hi')),
				transition: getAttr(ar, 'tra'),
			},
			departure: scheduledDeparture && {
				scheduledTime: scheduledDeparture,
				time: scheduledDeparture,
				wingIds: this.getWings(dp, true, rawId, wingIds),
				platform: getAttr(dp, 'pp'),
				scheduledPlatform: getAttr(dp, 'pp'),
				hidden: Boolean(getAttr(dp, 'hi')),
				transition: getAttr(dp, 'tra'),
			},
			productClass,
			currentStopPlace: {
				name: this.currentStopPlaceName,
				evaNumber: this.evaNumber,
			},
			scheduledDestination: routePost.at(-1) || this.currentStopPlaceName,
			id,
			rawId,
			mediumId,
			rawRoute: [...routePre, this.currentStopPlaceName, ...routePost],
			routePost: routePost.map<Route>(routeMap),
			routePre: routePre.map<Route>(routeMap),
			substitute: t === 'e' || undefined,
			train: {
				name: fullTrainText,
				number: number,
				line: timetableLineNumber || customLineNumber,
				type: category,
				admin: o,
			},
			additional: undefined as undefined | boolean,
		};
	}
	getTimetable(rawXml: string, wingIds: Record<string, string>) {
		const timetableXml = xmljs.parseXml(rawXml);

		const sArr = timetableXml.find<Element>('/timetable/s');

		const timetables: Record<string, any> = {};

		if (sArr) {
			for (const s of sArr) {
				const departure = this.parseTimetableS(s, wingIds);

				if (!departure) continue;
				timetables[departure.rawId] = departure;
			}
		}

		return timetables;
	}
	async getTimetables() {
		await Promise.all(
			this.segments.map(async (date) => {
				const key = `/plan/${this.evaNumber}/${format(date, 'yyMMdd/HH')}`;
				const cached = await timetableCache.get(key);
				if (cached) {
					this.timetable = {
						...this.timetable,
						...cached.timetable,
					};
					this.wingIds = {
						...this.wingIds,
						...cached.wingIds,
					};
					return;
				}

				try {
					const rawXml = await irisGetRequest<string>(key);
					const newWingIDs: Record<string, string> = {};
					const newDepartures = this.getTimetable(rawXml, newWingIDs);

					this.timetable = {
						...this.timetable,
						...newDepartures,
					};

					this.wingIds = {
						...this.wingIds,
						...newWingIDs,
					};

					void timetableCache.set(key, {
						timetable: newDepartures,
						wingIds: newWingIDs,
					});
				} catch (error) {
					this.errors.push(error);
				}
			}),
		);

		// Fixup recursive wings
		for (const [wingId, referenceRawId] of Object.entries(this.wingIds)) {
			const { mediumId } = parseRawId(referenceRawId);
			if (this.wingIds[mediumId]) {
				const arrival = this.timetable[this.wingIds[mediumId]]?.arrival;
				const departure = this.timetable[this.wingIds[mediumId]]?.departure;

				if (arrival) {
					arrival.wingIds = [...(arrival.wingIds || []), wingId];
				}

				if (departure) {
					departure.wingIds = [...(departure.wingIds || []), wingId];
				}

				this.wingIds[wingId] = this.wingIds[mediumId];
			}
		}
	}
}
