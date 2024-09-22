import {
	Configuration,
	VehicleSequencesApi,
} from '@/external/generated/risTransports';
import type { VehicleSequenceDeparture } from '@/external/generated/risTransports';
import { axiosUpstreamInterceptor } from '@/server/admin';
import { Cache, CacheDatabase } from '@/server/cache';
import { logger } from '@/server/logger';
import Axios from 'axios';
import {
	addHours,
	format,
	formatISO,
	isWithinInterval,
	subHours,
} from 'date-fns';

const risTransportsConfiguration = new Configuration({
	basePath: process.env.COACH_SEQUENCE_URL,
	baseOptions: {
		headers: {
			'DB-Api-Key': process.env.COACH_SEQUENCE_CLIENT_SECRET,
			'DB-Client-Id': process.env.COACH_SEQUENCE_CLIENT_ID,
			'User-Agent': 'bahn.expert',
		},
	},
});

const formatDate = (date?: Date) =>
	date ? format(date, 'yyyyMMddHHmm') : undefined;

const axiosWithTimeout = Axios.create({
	timeout: 4500,
});

axiosUpstreamInterceptor(axiosWithTimeout, 'coachSequence-risTransports');

const vehicleSequenceClient = new VehicleSequencesApi(
	risTransportsConfiguration,
	undefined,
	axiosWithTimeout,
);

const negativeHitCache = new Cache<boolean>(CacheDatabase.NegativeNewSequence);

export function isWithin20Hours(date: Date): boolean {
	const start = subHours(new Date(), 20);
	const end = addHours(new Date(), 20);
	return isWithinInterval(date, {
		start,
		end,
	});
}

export async function getDepartureSequence(
	trainCategory: string,
	trainNumber: number,
	evaNumber: string,
	plannedDepartureDate: Date,
	initialDepartureDate: Date,
): Promise<VehicleSequenceDeparture | undefined> {
	if (!isWithin20Hours(plannedDepartureDate)) {
		return undefined;
	}
	const formattedDate = formatDate(initialDepartureDate);
	const cacheKey = `${trainNumber}-${formattedDate}-${trainCategory}-${evaNumber}`;
	try {
		const wasNotFound = await negativeHitCache.exists(cacheKey);
		if (wasNotFound) {
			return undefined;
		}
		logger.debug('Trying new coachSequence');
		const r = await vehicleSequenceClient.vehicleSequenceDepartureUnmatched({
			category: trainCategory,
			journeyNumber: trainNumber,
			evaNumber,
			date: format(initialDepartureDate, 'yyyy-MM-dd'),
			timeSchedule: formatISO(plannedDepartureDate),
			includeAmenities: true,
			includePosition: true,
		});
		return r.data;
	} catch (e) {
		logger.debug(e, `new coach sequence errored (${e.response?.status})`);
		if (Axios.isAxiosError(e) && e.response?.status === 404) {
			void negativeHitCache.set(cacheKey, true);
		}
		return undefined;
	}
}
