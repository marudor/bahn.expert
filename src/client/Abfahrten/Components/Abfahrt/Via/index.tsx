import { Train } from 'types/abfahrten';

export function isHbf(stop: Train) {
  const lowered = stop.name.toLowerCase();

  return (
    lowered.includes('hbf') ||
    lowered.includes('centraal') ||
    lowered.includes('centrale') ||
    lowered.includes('termini')
  );
}
