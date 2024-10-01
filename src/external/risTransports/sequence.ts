import { VehicleSequencesApi } from '@/external/generated/risTransports';
import type { VehicleSequenceDeparture } from '@/external/generated/risTransports';
import {
	isWithin20Hours,
	risTransportsConfiguration,
} from '@/external/risTransports/config';
import { axiosUpstreamInterceptor } from '@/server/admin';
import { Cache, CacheDatabase } from '@/server/cache';
import { logger } from '@/server/logger';
import { Temporal } from '@js-temporal/polyfill';
import Axios from 'axios';
import { format, formatISO } from 'date-fns';

const formatDate = (date?: Date) =>
	date ? format(date, 'yyyyMMddHHmm') : undefined;

const axiosWithTimeout = Axios.create({
	timeout: 4500,
	adapter: 'fetch',
});

axiosUpstreamInterceptor(axiosWithTimeout, 'coachSequence-risTransports');

const vehicleSequenceClient = new VehicleSequencesApi(
	risTransportsConfiguration,
	undefined,
	axiosWithTimeout,
);

let allowedAdministrations: string[] = [];

async function fetchAllowedAdministrations() {
	try {
		allowedAdministrations = (
			await vehicleSequenceClient.vehicleSequenceAdministrations()
		).data.administrations.map((a) => a.administrationID);
	} catch {
		// ignored
	}
}

if (process.env.NODE_ENV !== 'test') {
	void fetchAllowedAdministrations();
	setInterval(
		fetchAllowedAdministrations,
		Temporal.Duration.from('P1D').total('millisecond'),
	);
}

const negativeHitCache = new Cache<boolean>(CacheDatabase.NegativeNewSequence);

export async function getDepartureSequence(
	trainCategory: string,
	trainNumber: number,
	evaNumber: string,
	plannedDepartureDate: Date,
	administration?: string,
): Promise<VehicleSequenceDeparture | undefined | null> {
	if (!isWithin20Hours(plannedDepartureDate)) {
		return undefined;
	}
	if (administration && allowedAdministrations.length) {
		if (!allowedAdministrations.includes(administration)) {
			return null;
		}
	}
	const formattedDate = formatDate(plannedDepartureDate);
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
			date: format(plannedDepartureDate, 'yyyy-MM-dd'),
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
