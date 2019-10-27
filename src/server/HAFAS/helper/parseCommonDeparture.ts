import { CommonDeparture, ParsedCommon } from 'types/HAFAS';
import { CommonStopInfo } from 'types/api/common';
import { differenceInMinutes } from 'date-fns';
import checkReihung from './checkReihung';
import parseTime from './parseTime';

export default (
  d: CommonDeparture,
  date: Date,
  _common: ParsedCommon,
  trainType?: string
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
    reihung: checkReihung(scheduledTime, d.dTrnCmpSX, trainType),
    cancelled: d.dCncl,
    // messages: d.msgL ? parseMessages(d.msgL, common) : undefined,
  };
};
