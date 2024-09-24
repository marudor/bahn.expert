import { Configuration } from '@/external/generated/risTransports';
import { addHours, isWithinInterval, subHours } from 'date-fns';

export const risTransportsConfiguration = new Configuration({
	basePath: process.env.COACH_SEQUENCE_URL,
	baseOptions: {
		headers: {
			'DB-Api-Key': process.env.COACH_SEQUENCE_CLIENT_SECRET,
			'DB-Client-Id': process.env.COACH_SEQUENCE_CLIENT_ID,
			'User-Agent': 'bahn.expert',
		},
	},
});

export function isWithin20Hours(date: Date): boolean {
	const start = subHours(new Date(), 20);
	const end = addHours(new Date(), 20);
	return isWithinInterval(date, {
		start,
		end,
	});
}
