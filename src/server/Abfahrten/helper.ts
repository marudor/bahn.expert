import { Element } from 'libxmljs2';
import { parseFromTimeZone } from 'date-fns-timezone';

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
