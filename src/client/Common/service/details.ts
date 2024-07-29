import type { AdditionalJourneyInformation } from '@/types/HAFAS/JourneyDetails';
import type { ParsedJourneyMatchResponse } from '@/types/HAFAS/JourneyMatch';
import type { ParsedSearchOnTripResponse } from '@/types/HAFAS/SearchOnTrip';
import Axios from 'axios';
import type { CancelToken, Canceler } from 'axios';

export async function getDetails(
	train: string,
	initialDepartureDate?: Date,
	evaNumberAlongRoute?: string,
	journeyId?: string | null,
	administration?: string,
	// HAFAS JID
	jid?: string | null,
): Promise<ParsedSearchOnTripResponse> {
	const r = await Axios.get<ParsedSearchOnTripResponse>(
		`/api/journeys/v1/details/${train}`,
		{
			params: {
				evaNumberAlongRoute,
				initialDepartureDate,
				journeyId: journeyId,
				administration,
				jid,
			},
		},
	);

	return r.data;
}

export async function getAdditionalJourneyInformation(
	trainName: string,
	journeyId: string,
	initialDepartureDate?: Date,
	evaNumberAlongRoute?: string,
): Promise<AdditionalJourneyInformation | undefined> {
	try {
		return (
			await Axios.get<AdditionalJourneyInformation>(
				`/api/hafas/v3/additionalInformation/${trainName}/${journeyId}`,
				{
					params: {
						evaNumberAlongRoute,
						initialDepartureDate,
					},
				},
			)
		).data;
	} catch {
		return undefined;
	}
}

const journeyMatchCancelTokens: Record<string, Canceler> = {};

async function find(
	baseUrl: string,
	phrase: string | number,
	initialDepartureDate?: Date,
	initialEvaNumber?: string,
	filtered?: boolean,
	cancelIdent?: string,
	limit = 10,
) {
	let cancelToken: CancelToken | undefined;

	if (cancelIdent) {
		journeyMatchCancelTokens[cancelIdent]?.();
		cancelToken = new Axios.CancelToken((c) => {
			journeyMatchCancelTokens[cancelIdent] = c;
		});
	}
	const r = await Axios.get<ParsedJourneyMatchResponse[]>(
		`${baseUrl}/${phrase}`,
		{
			cancelToken,
			params: {
				initialDepartureDate,
				filtered,
				initialEvaNumber,
				limit,
			},
		},
	);

	return r.data;
}

export const journeyFind = find.bind(undefined, '/api/journeys/v1/find');

export const journeyNumberFind = find.bind(
	undefined,
	'/api/journeys/v1/find/number',
);
