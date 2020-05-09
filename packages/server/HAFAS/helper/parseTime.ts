import { addMilliseconds, addMinutes } from 'date-fns';
import parseDuration from './parseDuration';

function parseTime(date: Date, time: string): number;
function parseTime(date: Date, time: undefined): undefined;
function parseTime(date: Date, time?: string) {
  if (time) {
    let parsedDate = addMilliseconds(date, parseDuration(time));
    const TzDifference =
      parsedDate.getTimezoneOffset() - date.getTimezoneOffset();

    if (TzDifference !== 0) {
      parsedDate = addMinutes(parsedDate, TzDifference);
    }

    return parsedDate.getTime();
  }
}

export default parseTime;
