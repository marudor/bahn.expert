import type { StopPlaceGroupType } from 'business-hub/generated/risStations';

export * from './generated/risStations/api';

export type ResolvedStopPlaceGroups = Partial<
  Record<StopPlaceGroupType, string[]>
>;
