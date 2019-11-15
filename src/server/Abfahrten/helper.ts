import { Element } from 'libxmljs2';
import { logger } from 'server/logger';
import { parseFromTimeZone } from 'date-fns-timezone';
import Axios from 'axios';
import config from 'server/config';

export const noncdAxios = Axios.create({
  baseURL: 'https://iris.noncd.db.de/iris-tts/timetable',
});
export const openDataAxios = config.timetableOpenDataAuthKey
  ? Axios.create({
      baseURL: 'https://api.deutschebahn.com/timetables/v1',
      headers: {
        Authorization: `Bearer ${config.timetableOpenDataAuthKey}`,
      },
    })
  : noncdAxios;

if (!config.timetableOpenDataAuthKey) {
  logger.warn('Timetable Open Data key missing, only noncd available');
}

export function getAttr(
  node: null | Element,
  name: string
): undefined | string {
  if (node) {
    const attr = node.attr(name);

    if (attr) {
      return attr.value();
    }
  }
}

export function getNumberAttr(
  node: null | Element,
  name: string
): undefined | number {
  const attr = getAttr(node, name);

  if (!attr) return undefined;

  return Number.parseInt(attr, 10);
}

export function getBoolAttr(node: null | Element, name: string): boolean {
  const attr = getAttr(node, name);

  if (!attr) return false;

  return attr === 'true';
}

export function parseTs(ts?: string): undefined | number {
  if (ts) {
    return parseFromTimeZone(ts, 'YYMMDDHHmm', {
      timeZone: 'Europe/Berlin',
    }).getTime();
  }
}
