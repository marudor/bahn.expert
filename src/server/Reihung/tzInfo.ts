import tzInfo from './staticTzInfo.json';

export interface TzInfo {
  br: string;
  tzn: string;
  uicList: string[];
}

export function infoByTZ(rawTz?: string): TzInfo | undefined {
  if (!rawTz) return;
  let tz = rawTz;

  if (!tz.startsWith('TZ')) {
    tz = `TZ${rawTz}`;
  }

  return tzInfo[tz as keyof typeof tzInfo];
}

export function BRByTZ(tz?: string): string | undefined {
  return infoByTZ(tz)?.br;
}

export function isRedesignByTZ(tz?: string): boolean | undefined {
  return BRByTZ(tz)?.includes('RD');
}

export function infoByUIC(uic: string): TzInfo | undefined {
  return Object.values(tzInfo).find(info => info.uicList.includes(uic));
}

export function BRByUIC(uic: string) {
  return infoByUIC(uic)?.br;
}

export function isRedesignByUIC(uic: string) {
  return BRByUIC(uic)?.includes('RD');
}
