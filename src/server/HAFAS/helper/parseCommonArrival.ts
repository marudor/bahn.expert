import type {
	CommonArrival,
	CommonStopInfo,
	ParsedCommon,
} from '@/types/HAFAS';
import { differenceInMinutes } from 'date-fns';
import parseTime from './parseTime';

export default (
	a: CommonArrival,
	date: Date,
	_common: ParsedCommon,
): CommonStopInfo => {
	const scheduledTime = parseTime(date, a.aTimeS, a.aTZOffset);
	let time = scheduledTime;
	let delay: number | undefined;

	if (a.aTimeR) {
		time = parseTime(date, a.aTimeR, a.aTZOffset);
		delay = time && scheduledTime && differenceInMinutes(time, scheduledTime);
	}

	return {
		scheduledPlatform: a.aPlatfR && a.aPlatfS,
		platform: a.aPlatfR || a.aPlatfS,
		scheduledTime,
		time,
		delay,
		cancelled: a.aCncl,
	};
};
