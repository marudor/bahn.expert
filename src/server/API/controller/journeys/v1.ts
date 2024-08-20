import type { JourneyEventBased } from '@/external/generated/risJourneysV2';
import {
	findJourney,
	findJourneyHafasCompatible,
	health,
} from '@/external/risJourneys';
import {
	findJourneyHafasCompatible as findJourneyHafasCompatibleV2,
	findJourney as findJourneyV2,
	getJourneyDetails,
} from '@/external/risJourneysV2';
import Detail from '@/server/HAFAS/Detail';
import { enrichedJourneyMatch } from '@/server/HAFAS/JourneyMatch';
import { getCategoryAndNumberFromName } from '@/server/journeys/journeyDetails';
import { journeyDetails } from '@/server/journeys/v2/journeyDetails';
import type { ParsedJourneyMatchResponse } from '@/types/HAFAS/JourneyMatch';
import type { ParsedSearchOnTripResponse } from '@/types/HAFAS/SearchOnTrip';
import type { EvaNumber } from '@/types/common';
import {
	Controller,
	Get,
	Hidden,
	Query,
	Request,
	Res,
	Response,
	Route,
	Tags,
} from '@tsoa/runtime';
import type { TsoaResponse } from '@tsoa/runtime';
import { differenceInHours } from 'date-fns';
import type { Request as KoaRequest } from 'koa';

const allowedReferer = ['https://bahn.expert', 'https://beta.bahn.expert'];
export function isAllowed(req: KoaRequest): boolean {
	return (
		process.env.NODE_ENV !== 'production' ||
		allowedReferer.some((r) => req.headers.referer?.startsWith(r))
	);
}

function findV1OrV2HafasCompatible(
	trainNumber: number,
	category?: string,
	date?: Date,
	onlyFv?: boolean,
) {
	const is20HoursOrMoreInFuture =
		date && differenceInHours(date, Date.now()) >= 20;

	if (is20HoursOrMoreInFuture) {
		return findJourneyHafasCompatibleV2(trainNumber, category, date, onlyFv);
	}
	return findJourneyHafasCompatible(trainNumber, category, date, onlyFv);
}

function findJoureyV1OrV2(
	trainNumber: number,
	category?: string,
	date?: Date,
	onlyFv?: boolean,
	originEvaNumber?: string,
	administration?: string,
) {
	const is20HoursOrMoreInFuture =
		date && differenceInHours(date, Date.now()) >= 20;

	if (is20HoursOrMoreInFuture) {
		return findJourneyV2(
			trainNumber,
			category,
			date,
			onlyFv,
			originEvaNumber,
			administration,
		);
	}
	return findJourney(
		trainNumber,
		category,
		date,
		onlyFv,
		originEvaNumber,
		administration,
	);
}

@Route('/journeys/v1')
export class JourneysV1Controller extends Controller {
	@Hidden()
	@Get('/health')
	health(
		@Res() notFound: TsoaResponse<404, void>,
		@Res() notAuthorized: TsoaResponse<401, void>,
	): Promise<any> {
		if (health.has401) {
			return notAuthorized(401);
		}
		return notFound(404);
	}

	@Get('/find/number/{trainNumber}')
	@Tags('Journeys')
	async findNumber(
		@Request() req: KoaRequest,
		@Res() response: TsoaResponse<401, string>,
		trainNumber: number,
		@Query() initialDepartureDate?: Date,
		@Query() initialEvaNumber?: string,
		// Only FV, legacy reasons for hafas compatibility
		@Query() filtered?: boolean,
		@Query() limit?: number,
	): Promise<ParsedJourneyMatchResponse[]> {
		if (!isAllowed(req)) {
			return response(
				401,
				'This is rate-limited upstream, please do not use it.',
			);
		}
		let risPromise: Promise<ParsedJourneyMatchResponse[]> = Promise.resolve([]);
		if (trainNumber) {
			risPromise = findV1OrV2HafasCompatible(
				trainNumber,
				undefined,
				initialDepartureDate,
				filtered,
			);
		}

		const trainName = trainNumber.toString();
		const hafasPromise = enrichedJourneyMatch({
			onlyRT: true,
			jnyFltrL: filtered
				? [
						{
							mode: 'INC',
							type: 'PROD',
							value: '7',
						},
					]
				: undefined,
			trainName,
			initialDepartureDate,
			limit,
		});

		const risResult = await risPromise;

		let result = risResult.length ? risResult : await hafasPromise;
		if (initialEvaNumber) {
			result = result.filter(
				(r) => r.firstStop.station.evaNumber === initialEvaNumber,
			);
		}

		return result.slice(0, limit);
	}

	@Hidden()
	@Get('/find/{trainName}')
	@Tags('Journeys')
	async find(
		@Request() req: KoaRequest,
		@Res() response: TsoaResponse<401, string>,
		trainName: string,
		@Query() initialDepartureDate?: Date,
		@Query() initialEvaNumber?: string,
		// Only FV, legacy reasons for hafas compatibility
		@Query() filtered?: boolean,
		@Query() limit?: number,
	): Promise<ParsedJourneyMatchResponse[]> {
		if (!isAllowed(req)) {
			return response(
				401,
				'This is rate-limited upstream, please do not use it.',
			);
		}
		let risPromise: Promise<ParsedJourneyMatchResponse[]> = Promise.resolve([]);
		const productDetails = getCategoryAndNumberFromName(trainName);
		if (productDetails) {
			risPromise = findV1OrV2HafasCompatible(
				productDetails.trainNumber,
				productDetails.category,
				initialDepartureDate,
				filtered,
			);
		}
		const hafasPromise = enrichedJourneyMatch({
			onlyRT: true,
			jnyFltrL: filtered
				? [
						{
							mode: 'INC',
							type: 'PROD',
							value: '7',
						},
					]
				: undefined,
			trainName,
			initialDepartureDate,
			limit,
		});

		const risResult = await risPromise;

		let result = risResult.length ? risResult : await hafasPromise;
		if (initialEvaNumber) {
			result = result.filter(
				(r) => r.firstStop.station.evaNumber === initialEvaNumber,
			);
		}

		return result.slice(0, limit);
	}

	@Hidden()
	@Get('/details/id/{journeyId}')
	@Response(404)
	@Tags('Journeys')
	async idDetails(
		@Request() req: KoaRequest,
		@Res() res: TsoaResponse<401 | 404, unknown>,
		journeyId: string,
	): Promise<JourneyEventBased> {
		if (!isAllowed(req)) {
			return res(401, 'This is rate-limited upstream, please do not use it.');
		}
		const journey = await getJourneyDetails(journeyId);
		if (!journey) {
			return res(404, undefined);
		}
		return journey;
	}

	@Hidden()
	@Get('/details/{trainName}')
	@Response(404)
	@Tags('Journeys')
	async details(
		@Request() req: KoaRequest,
		@Res() res: TsoaResponse<401 | 404, unknown>,
		trainName: string,
		@Query() evaNumberAlongRoute?: EvaNumber,
		@Query() initialDepartureDate?: Date,
		@Query() journeyId?: string,
		// HAFAS JID as fallback for number 0 trains
		@Query() jid?: string,
		@Query() administration?: string,
	): Promise<ParsedSearchOnTripResponse> {
		if (!isAllowed(req)) {
			return res(401, 'This is rate-limited upstream, please do not use it.');
		}
		if (journeyId) {
			const journey = await journeyDetails(journeyId);
			if (!journey) {
				return res(404, undefined);
			}
			return journey;
		}
		const hafasDetailsPromise = Detail(
			trainName,
			undefined,
			evaNumberAlongRoute,
			initialDepartureDate,
			undefined,
			undefined,
			administration,
			jid,
		);
		const hafasFallback = async () => {
			const hafasResult = await hafasDetailsPromise;
			if (!hafasResult) {
				return res(404, undefined);
			}
			return hafasResult;
		};
		const productDetails = getCategoryAndNumberFromName(trainName);
		if (!productDetails) {
			return hafasFallback();
		}
		const possibleJourneys = await findJoureyV1OrV2(
			productDetails.trainNumber,
			productDetails.category,
			initialDepartureDate,
			false,
			undefined,
			administration,
		);
		if (!possibleJourneys.length) {
			return hafasFallback();
		}
		let foundJourney: ParsedSearchOnTripResponse | undefined;
		const firstJourneyTransport =
			'transport' in possibleJourneys[0]
				? possibleJourneys[0].transport
				: possibleJourneys[0].info.transportAtStart;

		if (
			(possibleJourneys.length > 1 ||
				(productDetails.category &&
					firstJourneyTransport.category !== productDetails.category)) &&
			evaNumberAlongRoute
		) {
			const allJourneys = (
				await Promise.all(
					possibleJourneys.map((j) => journeyDetails(j.journeyID)),
				)
			).filter(Boolean);
			foundJourney = allJourneys.find((j) =>
				j.stops.map((s) => s.station.evaNumber).includes(evaNumberAlongRoute),
			);
		} else {
			foundJourney = await journeyDetails(possibleJourneys[0].journeyID);
		}
		if (!foundJourney) {
			return hafasFallback();
		}

		return foundJourney;
	}
}
