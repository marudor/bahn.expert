import { isDate } from 'date-fns';

export function convertDateToEpoch(o: any): any {
  if (!o) return;
  if (Array.isArray(o)) {
    o.forEach(convertDateToEpoch);
  } else if (o.constructor === Object) {
    for (const [key, value] of Object.entries(o)) {
      convertDateToEpoch(value);
      if (isDate(value)) {
        // @ts-expect-error this is type unsafe
        o[key] = value.getTime();
      }
    }
  }
}
