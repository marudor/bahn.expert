import type { StopPlaceGroupType } from '@/external/generated/risStations';

export * from './generated/risStations/api';

export type ResolvedStopPlaceGroups = Partial<
  Record<StopPlaceGroupType, string[]>
>;
