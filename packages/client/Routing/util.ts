/* eslint import/prefer-default-export: 0 */
import type { Station } from 'types/station';

export function formatDuration(duration: number): string {
  const durInMinutes = duration / 1000 / 60;
  const hours = Math.floor(durInMinutes / 60);
  const minutes = Math.floor(durInMinutes % 60);

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}`;
}

export function getRouteLink(
  start: Station,
  destination: Station,
  via: Station[],
  date?: Date | null,
): string {
  return `/routing/${start.id}/${destination.id}/${
    date?.getTime() || 0
  }/${via.map((v) => `${v.id}|`).join('')}`;
}
