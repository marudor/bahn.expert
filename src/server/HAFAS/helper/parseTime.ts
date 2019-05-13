import { addMilliseconds } from 'date-fns';
import parseDuration from './parseDuration';

// @ts-ignore ???
declare function parseTime(date: number, time: string): number;
// @ts-ignore ???
declare function parseTime(date: number, time: undefined): undefined;
function parseTime(date: number, time?: string) {
  if (time) {
    return addMilliseconds(date, parseDuration(time)).getTime();
  }
}

export default parseTime;
