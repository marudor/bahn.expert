import { addMilliseconds, addMinutes } from 'date-fns';
import parseDuration from './parseDuration';

function parseTime(date: Date, time: string, tzOffset?: number): Date;
function parseTime(date: Date, time: undefined, tzOffset?: number): undefined;
function parseTime(
  date: Date,
  time?: string,
  tzOffset?: number,
): Date | undefined {
  if (time) {
    let parsedDate = addMilliseconds(date, parseDuration(time));
    // Summer/Winter Time
    const tzDifference =
      parsedDate.getTimezoneOffset() - date.getTimezoneOffset();

    if (tzDifference !== 0) {
      parsedDate = addMinutes(parsedDate, tzDifference);
    }

    if (tzOffset) {
      const parsedDateTZOffset = -1 * parsedDate.getTimezoneOffset();
      if (parsedDateTZOffset !== tzOffset) {
        const difference = parsedDateTZOffset - tzOffset;
        parsedDate = addMinutes(parsedDate, difference);
      }
    }

    return parsedDate;
  }
}

export default parseTime;
