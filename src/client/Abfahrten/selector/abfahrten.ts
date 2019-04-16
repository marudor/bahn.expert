import { Abfahrt, ResolvedWings } from 'types/abfahrten';
import { AbfahrtenState } from 'AppState';
import { createSelector } from 'reselect';

type AbfahrtProps = {
  abfahrt: Abfahrt;
};

export const getWings = (state: AbfahrtenState) => state.abfahrten.wings;
export const getSelectedDetail = (state: AbfahrtenState) =>
  state.abfahrten.selectedDetail;
export const getArrivalWingIdsFromProps = (_: any, props: AbfahrtProps) =>
  props.abfahrt.arrivalWingIds;
export const getDepartureWingIdsFromProps = (_: any, props: AbfahrtProps) =>
  props.abfahrt.departureWingIds;
export const getIdFromProps = (_: any, props: AbfahrtProps) => props.abfahrt.id;
export const getNextDeparture = (state: AbfahrtenState) => {
  if (state.abfahrten.abfahrten) {
    return state.abfahrten.abfahrten.find(a => Boolean(a.scheduledDeparture));
  }
};

export const getAbfahrtenForConfig = createSelector(
  (state: AbfahrtenState) => state.abfahrten.abfahrten,
  state => state.config.config.onlyDepartures,
  state => state.abfahrten.selectedDetail,
  (abfahrten, onlyDepartures, selectedDetail) => {
    if (abfahrten && onlyDepartures) {
      return abfahrten.filter(a => a.departure || a.id === selectedDetail);
    }

    return abfahrten;
  }
);
export const getWingsForAbfahrt = createSelector(
  getWings,
  getArrivalWingIdsFromProps,
  getDepartureWingIdsFromProps,
  (wings, arrivalWingIds, departureWingIds) =>
    wings
      ? {
          arrivalWings: arrivalWingIds
            ? arrivalWingIds.map(w => wings[w]).filter(Boolean)
            : undefined,
          departureWings: departureWingIds
            ? departureWingIds.map(w => wings[w]).filter(Boolean)
            : undefined,
        }
      : undefined
);

export const getDetailForAbfahrt = createSelector(
  getSelectedDetail,
  getIdFromProps,
  (selectedDetail, id) => selectedDetail === id
);
