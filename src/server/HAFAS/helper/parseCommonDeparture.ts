import { differenceInMinutes } from 'date-fns';
import checkCoachSequence from './checkCoachSequence';
import parseTime from './parseTime';
import type {
  CommonDeparture,
  CommonStopInfo,
  ParsedCommon,
  ParsedProduct,
} from '@/types/HAFAS';

export default (
  d: CommonDeparture,
  date: Date,
  _common: ParsedCommon,
  train?: ParsedProduct,
): CommonStopInfo => {
  const scheduledTime = parseTime(date, d.dTimeS);

  let time = scheduledTime;
  let delay;

  if (d.dTimeR) {
    time = parseTime(date, d.dTimeR);
    delay = time && scheduledTime && differenceInMinutes(time, scheduledTime);
  }

  return {
    scheduledPlatform: d.dPlatfR && d.dPlatfS,
    platform: d.dPlatfR || d.dPlatfS,
    scheduledTime,
    time,
    delay,
    reihung: checkCoachSequence(scheduledTime, d.dTrnCmpSX, train),
    cancelled: d.dCncl,
    // messages: d.msgL ? parseMessages(d.msgL, common) : undefined,
  };
};
