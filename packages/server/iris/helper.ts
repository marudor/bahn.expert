import { parse } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import Axios from 'axios';
import type { Element } from 'libxmljs2';
import type { Stop } from 'types/iris';

export const noncdRequest = Axios.create({
  baseURL: 'https://iris.noncd.db.de/iris-tts/timetable',
});

export function getAttr<T extends string>(
  node: null | Element,
  name: string,
): undefined | T {
  if (node) {
    const attr = node.attr(name);

    if (attr) {
      return attr.value() as any;
    }
  }
}

export function getNumberAttr(
  node: null | Element,
  name: string,
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

export function parseTs(ts?: string): undefined | Date {
  if (ts) {
    return zonedTimeToUtc(parse(ts, 'yyMMddHHmm', Date.now()), 'Europe/Berlin');
  }
}

const hbfRegex = /(HB$|Hbf|Centraal|Flughafen)/;
export function calculateVia(route: any, maxParts = 3): void {
  const via: Stop[] = [...route].filter((v) => !v.cancelled);

  via.pop();
  const important = via.filter((v) => hbfRegex.exec(v.name));

  const showing = [];

  if (important.length >= maxParts) {
    showing.push(via[0]);
  } else {
    showing.push(...via.splice(0, maxParts - important.length));
  }

  while (showing.length < maxParts && important.length) {
    const stop = important.shift()!;

    if (!showing.includes(stop)) {
      showing.push(stop);
    }
  }
  showing.forEach((v) => (v.showVia = true));
}
