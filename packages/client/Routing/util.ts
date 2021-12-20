/* eslint import/prefer-default-export: 0 */
import type { MinimalStopPlace } from 'types/stopPlace';

export function formatDuration(duration: number): string {
  const durInMinutes = duration / 1000 / 60;
  const hours = Math.floor(durInMinutes / 60);
  const minutes = Math.floor(durInMinutes % 60);

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}`;
}

export function getRouteLink(
  start: MinimalStopPlace,
  destination: MinimalStopPlace,
  via: (MinimalStopPlace | undefined)[],
  date?: Date | null,
): string {
  return `/routing/${start.evaNumber}/${destination.evaNumber}/${
    date?.toISOString() || 0
  }/${via.map((v) => `${v?.evaNumber}|`).join('')}`;
}
