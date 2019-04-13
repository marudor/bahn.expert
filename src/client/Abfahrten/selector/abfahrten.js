// @flow
import { createSelector } from 'reselect';
import type { Abfahrt, ResolvedWings, Wings } from 'types/abfahrten';
import type { AbfahrtenState } from 'AppState';

type AbfahrtProps = {
  +abfahrt: Abfahrt,
};

type AbfahrtenSubstate = {
  +abfahrten: $ElementType<AbfahrtenState, 'abfahrten'>,
};

export const getWings = (state: AbfahrtenSubstate) => state.abfahrten.wings;
export const getSelectedDetail = (state: AbfahrtenSubstate) =>
  state.abfahrten.selectedDetail;
export const getArrivalWingIdsFromProps = (
  _: AbfahrtenSubstate,
  props: AbfahrtProps
) => props.abfahrt.arrivalWingIds;
export const getDepartureWingIdsFromProps = (
  _: AbfahrtenSubstate,
  props: AbfahrtProps
) => props.abfahrt.departureWingIds;
export const getIdFromProps = (_: AbfahrtenSubstate, props: AbfahrtProps) =>
  props.abfahrt.id;
export const getNextDeparture = (state: AbfahrtenSubstate) => {
  if (state.abfahrten.abfahrten) {
    return state.abfahrten.abfahrten.find(a => a.scheduledDeparture);
  }
};

export const getAbfahrtenForConfig = createSelector<
  AbfahrtenState,
  void,
  ?(Abfahrt[]),
  ?(Abfahrt[]),
  boolean,
  ?string
>(
  state => state.abfahrten.abfahrten,
  state => state.config.config.onlyDepartures,
  state => state.abfahrten.selectedDetail,
  (abfahrten, onlyDepartures, selectedDetail) => {
    if (abfahrten && onlyDepartures) {
      return abfahrten.filter(a => a.departure || a.id === selectedDetail);
    }

    return abfahrten;
  }
);
export const getWingsForAbfahrt = createSelector<
  AbfahrtenSubstate,
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

export const getDetailForAbfahrt = createSelector<
  AbfahrtenSubstate,
  AbfahrtProps,
  boolean,
  ?string,
  string
>(
  getSelectedDetail,
  getIdFromProps,
  (selectedDetail, id) => selectedDetail === id
);
