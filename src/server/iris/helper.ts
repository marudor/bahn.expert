import { checkSecrets } from 'server/checkSecret';
import { isValid, parse } from 'date-fns';
import { upstreamApiCountInterceptor } from 'server/admin';
import { zonedTimeToUtc } from 'date-fns-tz';
import Axios from 'axios';
import type { AxiosInstance } from 'axios';
import type { Element } from 'libxmljs2';
import type { Stop } from 'types/iris';

const noncdRequest = Axios.create({
  baseURL: process.env.IRIS_URL || 'http://iris.dummy',
  headers: {
    'user-agent': '',
  },
  timeout: 5000,
});

// eslint-disable-next-line import/no-mutable-exports
let fallbackRequest: AxiosInstance | undefined;
if (process.env.IRIS_FALLBACK_URL) {
  fallbackRequest = Axios.create({
    baseURL: process.env.IRIS_FALLBACK_URL,
    headers: {
      'user-agent': '',
    },
  });
  fallbackRequest.interceptors.request.use(
    upstreamApiCountInterceptor.bind(undefined, 'iris-fallback'),
  );
}

noncdRequest.interceptors.request.use(
  upstreamApiCountInterceptor.bind(undefined, 'iris-noncd'),
);

checkSecrets(process.env.IRIS_URL, process.env.IRIS_FALLBACK_URL);

export async function irisGetRequest<T>(url: string): Promise<T> {
  try {
    const result = (await noncdRequest.get<T>(url)).data;
    return result;
  } catch (error) {
    if (fallbackRequest && Axios.isAxiosError(error)) {
      const fallbackResult = (await fallbackRequest.get<T>(url)).data;
      return fallbackResult;
    }
    throw error;
  }
}

/**
 * Works if node has 'ts' or 'ts-tts'
 */
export function getTsOfNode(node: null | Element): ReturnType<typeof parseTs> {
  let timestamp = parseTs(getAttr(node, 'ts-tts'));
  if (!timestamp) {
    timestamp = parseTs(getAttr(node, 'ts'));
  }
  return timestamp;
}

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
    const format = ts.includes('-') ? 'yy-MM-dd HH:mm:ss.SSS' : 'yyMMddHHmm';
    const parsedDate = parse(ts, format, Date.now());
    if (isValid(parsedDate)) {
      return zonedTimeToUtc(parsedDate, 'Europe/Berlin');
    }
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
  for (const v of showing) v.showVia = true;
}
