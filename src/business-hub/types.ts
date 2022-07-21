import type { StopPlaceGroupType } from 'business-hub/generated';

export * from './generated/api';

export type ResolvedStopPlaceGroups = Partial<
  Record<StopPlaceGroupType, string[]>
>;
