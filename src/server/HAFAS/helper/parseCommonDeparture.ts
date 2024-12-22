import type {
	CommonDeparture,
	CommonStopInfo,
	ParsedCommon,
} from '@/types/HAFAS';
import { differenceInMinutes } from 'date-fns';
import parseTime from './parseTime';

export default (
	d: CommonDeparture,
	date: Date,
	_common: ParsedCommon,
): CommonStopInfo => {
	const scheduledTime = parseTime(date, d.dTimeS, d.dTZOffset);

	let time = scheduledTime;
	let delay: number | undefined;

	if (d.dTimeR) {
		time = parseTime(date, d.dTimeR, d.dTZOffset);
		delay =
			time &&
			scheduledTime &&
			differenceInMinutes(time, scheduledTime, {
				roundingMethod: 'floor',
			});
	}

	return {
		scheduledPlatform: d.dPlatfR && d.dPlatfS,
		platform: d.dPlatfR || d.dPlatfS,
		scheduledTime,
		time,
		delay,
		cancelled: d.dCncl,
		// messages: d.msgL ? parseMessages(d.msgL, common) : undefined,
	};
};
