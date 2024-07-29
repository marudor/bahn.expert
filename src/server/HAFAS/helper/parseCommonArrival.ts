import type {
	CommonArrival,
	CommonStopInfo,
	ParsedCommon,
	ParsedProduct,
} from '@/types/HAFAS';
import { differenceInMinutes } from 'date-fns';
import checkCoachSequence from './checkCoachSequence';
import parseTime from './parseTime';

export default (
	a: CommonArrival,
	date: Date,
	_common: ParsedCommon,
	train?: ParsedProduct,
): CommonStopInfo => {
	const scheduledTime = parseTime(date, a.aTimeS, a.aTZOffset);
	let time = scheduledTime;
	let delay: number | undefined;

	if (a.aTimeR) {
		time = parseTime(date, a.aTimeR, a.aTZOffset);
		delay = time && scheduledTime && differenceInMinutes(time, scheduledTime);
	}

	console.log(a);

	return {
		scheduledPlatform: a.aPlatfR && a.aPlatfS,
		platform: a.aPlatfR || a.aPlatfS,
		scheduledTime,
		time,
		delay,
		reihung: checkCoachSequence(scheduledTime, a.aTrnCmpSX, train),
		cancelled: a.aCncl,
		// messages: a.msgL ? parseMessages(a.msgL, common) : undefined,
	};
};
