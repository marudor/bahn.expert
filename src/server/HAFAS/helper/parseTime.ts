import { addMilliseconds, addMinutes } from 'date-fns';
import parseDuration from './parseDuration';

function parseTime(date: Date, time: string): Date;
function parseTime(date: Date, time: undefined): undefined;
function parseTime(date: Date, time?: string): Date | undefined {
  if (time) {
    let parsedDate = addMilliseconds(date, parseDuration(time));
    const TzDifference =
      parsedDate.getTimezoneOffset() - date.getTimezoneOffset();

    if (TzDifference !== 0) {
      parsedDate = addMinutes(parsedDate, TzDifference);
    }

    return parsedDate;
  }
}

export default parseTime;
