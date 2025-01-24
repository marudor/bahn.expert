import { Agent } from 'node:https';
import { mapFahrt } from '@/bahnde/journeyDetails/parseJourneyDetails';
import { addRandomBrowserUseragent } from '@/bahnde/randomUseragent';
import { axiosUpstreamInterceptor } from '@/server/admin';
import { CacheDatabase, getCache } from '@/server/cache';
import { logger } from '@/server/logger';
import type { JourneyResponse } from '@/types/journey';
import axios, { type InternalAxiosRequestConfig } from 'axios';
import { v4 } from 'uuid';

const bahnDeJourneyDetailsInterceptor = (req: InternalAxiosRequestConfig) => {
	req.headers.set('accept', 'application/json');
	req.headers.set('content-type', 'application/json; charset=utf-8');
	req.headers.set('Referer', 'https://www.bahn.de/buchung/fahrplan/suche');
	req.headers.set('Origin', 'https://www.bahn.de');
	req.headers.set('x-correlation-id', `${v4()}_${v4()}`);
	return req;
};

const journeyDetailsAxios = axios.create({
	baseURL: 'https://www.bahn.de/web/api/reiseloesung',
});
journeyDetailsAxios.interceptors.request.use(addRandomBrowserUseragent);
journeyDetailsAxios.interceptors.request.use(bahnDeJourneyDetailsInterceptor);
axiosUpstreamInterceptor(journeyDetailsAxios, 'bahn.de-journeyDetails');

const v6JourneyDetailsAxios = axios.create({
	baseURL: 'https://www.bahn.de/web/api/reiseloesung',
	httpsAgent: new Agent({
		family: 6,
	}),
});
v6JourneyDetailsAxios.interceptors.request.use(addRandomBrowserUseragent);
v6JourneyDetailsAxios.interceptors.request.use(bahnDeJourneyDetailsInterceptor);
axiosUpstreamInterceptor(v6JourneyDetailsAxios, 'bahn.de-journeyDetails-v6');

const quickJourneyDetailsCache = getCache(CacheDatabase.BahnDEJourneyDetails);

export const bahnJourneyDetails = async (
	jid: string,
	useV6?: boolean,
): Promise<JourneyResponse | undefined> => {
	try {
		if (await quickJourneyDetailsCache.exists(jid)) {
			return quickJourneyDetailsCache.get(jid);
		}

		const axios = useV6 ? v6JourneyDetailsAxios : journeyDetailsAxios;

		const rawResult = (
			await axios.get('/fahrt', {
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
