import { differenceInMinutes } from 'date-fns';
import checkCoachSequence from './checkCoachSequence';
import parseTime from './parseTime';
import type {
  CommonArrival,
  CommonStopInfo,
  ParsedCommon,
  ParsedProduct,
} from '@/types/HAFAS';

export default (
  a: CommonArrival,
  date: Date,
  _common: ParsedCommon,
  train?: ParsedProduct,
): CommonStopInfo => {
  const scheduledTime = parseTime(date, a.aTimeS);
  let time = scheduledTime;
  let delay;

  if (a.aTimeR) {
    time = parseTime(date, a.aTimeR);
    delay = time && scheduledTime && differenceInMinutes(time, scheduledTime);
  }

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
