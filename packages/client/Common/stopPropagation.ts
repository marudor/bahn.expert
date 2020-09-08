import type { SyntheticEvent } from 'react';

export const stopPropagation = (e: SyntheticEvent): void => e.stopPropagation();
