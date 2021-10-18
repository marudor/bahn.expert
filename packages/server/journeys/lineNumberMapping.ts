import lines from './lines.json';

export function getLineFromNumber(journeyNumber?: string): string | undefined {
  if (!journeyNumber) return undefined;
  return (lines as any)[journeyNumber];
}
