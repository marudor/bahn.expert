import staticRedesign from './staticRedesign.json';

export function isRedesignByTZ(tz?: string): boolean | undefined {
  if (!tz) return;
  const sanitizedTZ = tz.startsWith('TZ') ? tz.substr(2) : tz;
  return staticRedesign.includes(sanitizedTZ);
}
