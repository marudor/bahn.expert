import { CommonDeparture, ParsedCommon } from 'types/HAFAS';
import { differenceInMinutes } from 'date-fns';
import { ParsedCommonDeparture } from 'types/common';
import parseMessages from './parseMessages';
import parseTime from './parseTime';

export default (
  d: CommonDeparture,
  date: number,
  common: ParsedCommon,
  trainType?: string
): ParsedCommonDeparture => {
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
    reihung:
      Boolean(d.dTrnCmpSX && d.dTrnCmpSX.tcM) ||
      trainType === 'IC' ||
      trainType === 'EC' ||
      undefined,
    messages: d.msgL ? parseMessages(d.msgL, common) : undefined,
  };
};
