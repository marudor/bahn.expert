// @flow
import { parseFromTimeZone } from 'date-fns-timezone';
import { type XmlNode } from 'libxmljs';

export function getAttr(node: ?XmlNode, name: string): ?string {
  // $FlowFixMe - optional chaining call
  return node?.attr(name)?.value();
}

export function getNumberAttr(node: ?XmlNode, name: string): ?number {
  const attr = getAttr(node, name);

  if (!attr) return undefined;

  return Number.parseInt(attr, 10);
}

export function getBoolAttr(node: ?XmlNode, name: string): boolean {
  const attr = getAttr(node, name);

  if (!attr) return false;

  return attr === 'true';
}

export function parseTs(ts: ?string): ?Date {
  if (ts) {
    return parseFromTimeZone(ts, 'YYMMDDHHmm', { timeZone: 'Europe/Berlin' }).getTime();
  }
}
