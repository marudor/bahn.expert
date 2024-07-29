import makeRequest from '@/server/HAFAS/Request';
import mapLoyalityCard from '@/server/HAFAS/TripSearch/mapLoyalityCard';
import type {
	AllowedHafasProfile,
	JourneyFilter,
	OptionalLocL,
} from '@/types/HAFAS';
import type {
	TripSearchOptionsV3,
	TripSearchOptionsV4,
	TripSearchRequest,
} from '@/types/HAFAS/TripSearch';
import type { RoutingResult } from '@/types/routing';
import { format } from 'date-fns-tz';
import NetzcardBetreiber from './NetzcardBetreiber.json';
import tripSearchParse from './parse';

const netzcardFilter: JourneyFilter[] = NetzcardBetreiber.map((betreiber) => ({
	mode: 'INC',
	type: 'OP',
	value: betreiber,
}));

const onlyRegionalFilter: JourneyFilter[] = [
	{
		value: '1016',
		mode: 'INC',
		type: 'PROD',
	},
];

const profileConfig = {
	db: {
		cfg: {
			rtMode: 'HYBRID',
		},
	},
};

function convertSingleCoordinate(singleCoordinate: number): number {
	const splittedCoordinate = singleCoordinate.toString().split('.');
	const pre = splittedCoordinate[0].padStart(2, '0');
	const post = (splittedCoordinate[1] || '').padEnd(6, '0').slice(0, 6);

	return Number.parseInt(`${pre}${post}`);
}

function startDestinationMap(
	startDest: string | TripSearchOptionsV4['start'],
): OptionalLocL {
	let eva: string | undefined;
	if (typeof startDest === 'string') {
		eva = startDest;
	} else {
		if (startDest.type === 'coordinate') {
			return {
				crd: {
					x: convertSingleCoordinate(startDest.longitude),
					y: convertSingleCoordinate(startDest.latitude),
				},
			};
		}
		eva = startDest.evaNumber;
	}

	return {
		lid: `A=1@L=${eva}@B=1`,
	};
}

export function tripSearch(
	{
		start,
		destination,
		via,
		time,
		transferTime = -1,
		maxChanges = -1,
		searchForDeparture = true,
		getPasslist = true,
		economic = true,
		ushrp = false,
		getPolyline = false,
		getIV = true,
		numF = 6,
		ctxScr,
		onlyRegional,
		onlyNetzcard,
		tarif,
	}: TripSearchOptionsV3 | TripSearchOptionsV4,
	profile?: AllowedHafasProfile,
	raw?: boolean,
): Promise<RoutingResult> {
	let requestTypeSpecific:
		| { outDate: string; outTime: string }
		| {
				ctxScr: string;
		  };
	if (!time && !ctxScr) {
		time = new Date();
	}

	if (time) {
		requestTypeSpecific = {
			outDate: format(time, 'yyyyMMdd', {
				timeZone: 'Europe/Berlin',
			}),
			outTime: format(time, 'HHmmss', {
				timeZone: 'Europe/Berlin',
			}),
		};
	} else if (ctxScr) {
		requestTypeSpecific = {
			ctxScr,
		};
	} else {
		throw new Error('Either Time or Context required');
	}

	const journeyFilter: JourneyFilter[] = [];
	if (onlyRegional) {
		journeyFilter.push(...onlyRegionalFilter);
	}
	if (onlyNetzcard) {
		journeyFilter.push(...netzcardFilter);
	}
	const arrLoc = startDestinationMap(destination);
	const depLoc = startDestinationMap(start);

	const req: TripSearchRequest = {
		req: {
			jnyFltrL: journeyFilter.length ? journeyFilter : undefined,
			// getPT: true,
			numF,
			...requestTypeSpecific,
			maxChg: maxChanges === -1 ? undefined : maxChanges,
			minChgTime: transferTime || undefined,
			getPasslist,
			economic,
			ushrp,
			getPolyline,
			getIV,
			// arrival / departure
			outFrwd: searchForDeparture ? undefined : false,
			arrLocL: [arrLoc],
			depLocL: [depLoc],
			viaLocL: via?.length
				? via.map((via) => ({
						loc: {
							lid: `A=1@L=${'evaNumber' in via ? via.evaNumber : via.evaId}`,
						},
						min: via.minChangeTime,
					}))
				: undefined,
			trfReq: tarif
				? {
						jnyCl: tarif.class,
						cType: 'PK',
						tvlrProf: tarif.traveler.map((t) => ({
							type: t.type,
							redtnCard: mapLoyalityCard(t.loyalityCard, profile),
						})),
					}
				: undefined,
		},
		meth: 'TripSearch',
		// @ts-expect-error spread works
		...profileConfig[profile ?? 'db'],
	};

	return makeRequest(req, raw ? undefined : tripSearchParse, profile);
}
