import type { Stop } from '@/types/iris';

export function isHbf(stop: Stop): boolean {
  const lowered = stop.name.toLowerCase();

  return (
    lowered.includes('hbf') ||
    lowered.includes('centraal') ||
    lowered.includes('centrale') ||
    lowered.includes('termini')
  );
}
