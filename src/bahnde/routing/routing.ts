import { Agent } from 'node:https';
import { addRandomBrowserUseragent } from '@/bahnde/randomUseragent';
import { parseBahnRouting } from '@/bahnde/routing/parseRouting';
import type {
	BahnDEProduktGattung,
	BahnDERoutingOptions,
	RoutingOptions,
} from '@/bahnde/types';
import { axiosUpstreamInterceptor } from '@/server/admin';
import { tz } from '@date-fns/tz';
import axios from 'axios';
import { formatDate } from 'date-fns';
import { v4 } from 'uuid';

const routingAxios = axios.create({
	baseURL: 'https://www.bahn.de/web/api/angebote',
});
routingAxios.interceptors.request.use(addRandomBrowserUseragent);
routingAxios.interceptors.request.use((req) => {
	req.headers.set('accept', 'application/json');
	req.headers.set('content-type', 'application/json; charset=utf-8');
	req.headers.set('Referer', 'https://www.bahn.de/buchung/fahrplan/suche');
	req.headers.set('Origin', 'https://www.bahn.de');
	req.headers.set('x-correlation-id', `${v4()}_${v4()}`);
	return req;
});
axiosUpstreamInterceptor(routingAxios, 'bahn.de-routing');
const httpsAgent = new Agent({
	family: 6,
});

const regionalOnlyProduktgattungen: BahnDEProduktGattung[] = [
	'REGIONAL',
	'SBAHN',
	'BUS',
	'SCHIFF',
	'UBAHN',
	'TRAM',
	'ANRUFPFLICHTIG',
] as const;

const allProduktgattungen: BahnDEProduktGattung[] = [
	...regionalOnlyProduktgattungen,
	'EC_IC',
	'ICE',
	'IR',
];

const formatHaltestellenId = (evaNumber: string) => `A=1@L=${evaNumber}@B=1`;

const europeBerlin = tz('Europe/Berlin');

export const routing = async ({
	start,
	destination,
	via,
	time,
	onlyRegional,
	maxChanges,
	searchForDeparture = true,
	transferTime,
	ctxScr,
	useV6,
}: RoutingOptions) => {
	const normalizedTime = time || new Date();
	const options: BahnDERoutingOptions = {
		produktgattungen: onlyRegional
			? regionalOnlyProduktgattungen
			: allProduktgattungen,
		minUmstiegszeit:
			transferTime && transferTime > 0 ? transferTime : undefined,
		maxUmstiege: maxChanges != null && maxChanges >= 0 ? maxChanges : undefined,
		ankunftSuche: searchForDeparture ? 'ABFAHRT' : 'ANKUNFT',
		anfrageZeitpunkt: `${formatDate(normalizedTime, 'yyyy-MM-dd', { in: europeBerlin })}T${formatDate(normalizedTime, 'HH:mm:ss', { in: europeBerlin })}`,
		abfahrtsHalt: formatHaltestellenId(start.evaNumber),
		ankunftsHalt: formatHaltestellenId(destination.evaNumber),
		zwischenhalte: via?.map((v) => ({
			id: formatHaltestellenId(v.evaNumber),
			aufenthaltsdauer: v.minChangeTime,
		})),
		bikeCarriage: false,
		deutschlandTicketVorhanden: false,
		nurDeutschlandTicketVerbindungen: false,
		reservierungsKontingenteVorhanden: false,
		schnelleVerbindungen: false,
		sitzplatzOnly: false,
		pagingReference: ctxScr,
		reisende: [
			{
				alter: [],
				anzahl: 1,
				ermaessigungen: [
					{
						art: 'KEINE_ERMAESSIGUNG',
						klasse: 'KLASSENLOS',
					},
				],
				typ: 'ERWACHSENER',
			},
		],
		klasse: 'KLASSE_2',
	};

	const rawResult = (
		await routingAxios.post('/fahrplan', options, {
			httpsAgent: useV6 ? httpsAgent : undefined,
		})
	).data;

	const parsed = await parseBahnRouting(rawResult);
	return parsed;
};
