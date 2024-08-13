import type { VehicleSequenceDeparture } from '@/external/generated/coachSequence';
import { UpstreamApiRequestMetric } from '@/server/admin';
import { mapInformation } from '@/server/coachSequence/DB/bahnDe/mapping';
import { logger } from '@/server/logger';
import type { CoachSequenceInformation } from '@/types/coachSequence';
import Axios from 'axios';
import { format, formatISO } from 'date-fns';

const dbCoachSequenceTimeout =
	process.env.NODE_ENV === 'production' ? 4500 : 10000;

const bahndeAxios = Axios.create({
	timeout: dbCoachSequenceTimeout,
});

export async function getNewDBCoachSequence(
	trainCategory: string,
	trainNumber: string,
	evaNumber: string,
	plannedDepartureDate: Date,
	initialDepartureDate: Date,
): Promise<CoachSequenceInformation | undefined> {
	try {
		UpstreamApiRequestMetric.inc({
			api: 'coachSequence-bahnde',
		});
		const sequence = (
			await bahndeAxios.get<VehicleSequenceDeparture>(
				'https://www.bahn.de/web/api/reisebegleitung/wagenreihung/vehicle-sequence',
				{
					params: {
						category: trainCategory,
						date: format(initialDepartureDate, 'yyyy-MM-dd'),
						time: formatISO(plannedDepartureDate),
						evaNumber,
						number: trainNumber,
					},
					headers: {
						'User-Agent': '',
					},
				},
			)
		).data;

		const mappedSequence = await mapInformation(
			sequence,
			trainCategory,
			trainNumber,
			evaNumber,
		);
		return mappedSequence;
	} catch (e) {
		logger.error(e, 'failed bahnde Sequence');
		// fallback on error
		return undefined;
	}
}
