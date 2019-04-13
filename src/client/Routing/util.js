// @flow
/* eslint import/prefer-default-export: 0 */

export function formatDuration(duration: number) {
  const durInMinutes = duration / 1000 / 60;
  const hours = Math.floor(durInMinutes / 60);
  const minutes = Math.floor(durInMinutes % 60);

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}`;
}
