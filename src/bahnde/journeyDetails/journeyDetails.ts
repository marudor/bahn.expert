import { mapFahrt } from '@/bahnde/journeyDetails/parseJourneyDetails';
import { addRandomBrowserUseragent } from '@/bahnde/randomUseragent';
import { axiosUpstreamInterceptor } from '@/server/admin';
import { CacheDatabase, getCache } from '@/server/cache';
import { logger } from '@/server/logger';
import type { ParsedSearchOnTripResponse } from '@/types/HAFAS/SearchOnTrip';
import axios from 'axios';
import { v4 } from 'uuid';

const journeyDetailsAxios = axios.create({
	baseURL: 'https://www.bahn.de/web/api/reiseloesung',
});
journeyDetailsAxios.interceptors.request.use(addRandomBrowserUseragent);
journeyDetailsAxios.interceptors.request.use((req) => {
	req.headers.set('accept', 'application/json');
	req.headers.set('content-type', 'application/json; charset=utf-8');
	req.headers.set('Referer', 'https://www.bahn.de/buchung/fahrplan/suche');
	req.headers.set('Origin', 'https://www.bahn.de');
	req.headers.set('x-correlation-id', `${v4()}_${v4()}`);
	return req;
});
axiosUpstreamInterceptor(journeyDetailsAxios, 'bahn.de-journeyDetails');

const quickJourneyDetailsCache = getCache(CacheDatabase.BahnDEJourneyDetails);

export const bahnJourneyDetails = async (
	jid: string,
): Promise<ParsedSearchOnTripResponse | undefined> => {
	try {
		if (await quickJourneyDetailsCache.exists(jid)) {
			return quickJourneyDetailsCache.get(jid);
		}

		const rawResult = (
			await journeyDetailsAxios.get('/fahrt', {
				params: {
					journeyId: jid,
				},
			})
		).data;

		const parsed = await mapFahrt(rawResult);
		if (parsed) {
			void quickJourneyDetailsCache.set(jid, parsed);
		}
		return parsed;
	} catch (e) {
		logger.error(e);
	}
};
