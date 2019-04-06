// @flow
export function delayString(delay: number = 0) {
  if (delay > 0) {
    return `+${delay}`;
  }

  return `-${Math.abs(delay)}`;
}

export function delayStyle(classes: { delayed: string, early: string }, delay: number = 0) {
  if (delay > 0) return classes.delayed;
  if (delay < 0) return classes.early;

  return '';
}
