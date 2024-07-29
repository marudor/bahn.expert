import {
	BoardsApi,
	Configuration as RisBoardsConfiguration,
} from '@/external/generated/risBoards';
import type {
	StopArrival,
	StopDeparture,
	TransportPublicDestinationVia,
	TransportPublicOriginVia,
} from '@/external/generated/risBoards';
import { axiosUpstreamInterceptor } from '@/server/admin';
import axios from 'axios';

const risBoardsConfiguration = new RisBoardsConfiguration({
	basePath: process.env.RIS_BOARDS_URL,
	baseOptions: {
		headers: {
			'DB-Api-Key': process.env.RIS_BOARDS_CLIENT_SECRET,
			'DB-Client-Id': process.env.RIS_BOARDS_CLIENT_ID,
		},
	},
});

const axiosWithTimeout = axios.create({
	timeout: 10000,
	headers: {
		'User-Agent':
			'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) QtWebEngine/5.15.8 Chrome/87.0.4280.144 Safari/537.36',
	},
});

axiosUpstreamInterceptor(axiosWithTimeout, 'ris-boards');

const boardsClient = new BoardsApi(
	risBoardsConfiguration,
	undefined,
	axiosWithTimeout,
);

interface CombinedArrivalDeparture {
	transport: TransportPublicDestinationVia | TransportPublicOriginVia;
	arrival?: StopArrival;
	departure?: StopDeparture;
}

// NOT SORTED
export async function departureAndArrivals(
	evaNumber: string,
	timeStart: Date,
	timeEnd: Date,
): Promise<CombinedArrivalDeparture[]> {
	try {
		const departurePromise = boardsClient
			.boardDeparture({
				evaNumbers: [evaNumber],
				includeStationGroup: true,
				timeStart: timeStart.toISOString(),
				timeEnd: timeEnd.toISOString(),
				filterTransports: [
					'HIGH_SPEED_TRAIN',
					'INTERCITY_TRAIN',
					'INTER_REGIONAL_TRAIN',
					'REGIONAL_TRAIN',
				],
			})
			.then((r) => r.data.departures);
		const arrivalPromise = boardsClient
			.boardArrival({
				evaNumbers: [evaNumber],
				includeStationGroup: true,
				timeStart: timeStart.toISOString(),
				timeEnd: timeEnd.toISOString(),
				filterTransports: [
					'HIGH_SPEED_TRAIN',
					'INTERCITY_TRAIN',
					'INTER_REGIONAL_TRAIN',
					'REGIONAL_TRAIN',
				],
			})
			.then((r) => r.data.arrivals);
		const [departures, arrivals] = await Promise.all([
			departurePromise,
			arrivalPromise,
		]);

		const combinedByJourneyId: Record<string, CombinedArrivalDeparture> = {};

		for (const dep of departures) {
			if (combinedByJourneyId[dep.journeyID]) {
				// ??? Problem for later
			}
			combinedByJourneyId[dep.journeyID] = {
				transport: dep.transport,
				departure: dep,
			};
			combinedByJourneyId;
		}

		for (const arr of arrivals) {
			const combined = combinedByJourneyId[arr.journeyID] || {
				transport: arr.transport,
			};
			if (combined.arrival) {
				// ?? Problem for later
			}
			combined.arrival = arr;
		}

		return Object.values(combinedByJourneyId);
	} catch {
		// just for enrichement, ignore if it doesn't work
		return [];
	}
}
