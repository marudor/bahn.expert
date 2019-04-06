// @flow
import { createSelector } from 'reselect';
import type { Abfahrt, ResolvedWings, Wings } from 'types/abfahrten';
import type { AbfahrtenState } from 'AppState';

type AbfahrtProps = {
  +abfahrt: Abfahrt,
};

export const getWings = (state: AbfahrtenState) => state.abfahrten.wings;
export const getSelectedDetail = (state: AbfahrtenState) => state.abfahrten.selectedDetail;
export const getArrivalWingIdsFromProps = (_: AbfahrtenState, props: AbfahrtProps) => props.abfahrt.arrivalWingIds;
export const getDepartureWingIdsFromProps = (_: AbfahrtenState, props: AbfahrtProps) => props.abfahrt.departureWingIds;
export const getIdFromProps = (_: AbfahrtenState, props: AbfahrtProps) => props.abfahrt.id;
export const getNextDeparture = (state: AbfahrtenState) => {
  if (state.abfahrten.abfahrten) {
    return state.abfahrten.abfahrten.find(a => a.scheduledDeparture);
  }
};

export const getWingsForAbfahrt = createSelector<
  AbfahrtenState,
  AbfahrtProps,
  ?ResolvedWings,
  ?Wings,
  ?(string[]),
  ?(string[])
>(
  getWings,
  getArrivalWingIdsFromProps,
  getDepartureWingIdsFromProps,
  (wings, arrivalWingIds, departureWingIds) =>
    wings
      ? {
          // $FlowFixMe - optional chaining call
          arrivalWings: arrivalWingIds?.map(w => wings[w]).filter(Boolean),
          // $FlowFixMe - optional chaining call
          departureWings: departureWingIds?.map(w => wings[w]).filter(Boolean),
        }
      : undefined
);

export const getDetailForAbfahrt = createSelector<AbfahrtenState, AbfahrtProps, boolean, ?string, string>(
  getSelectedDetail,
  getIdFromProps,
  (selectedDetail, id) => selectedDetail === id
);
