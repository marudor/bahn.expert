import { Abfahrt, ResolvedWings } from 'types/abfahrten';
import { AbfahrtenState } from 'AppState';
import { createSelector } from 'reselect';

type AbfahrtProps = {
  abfahrt: Abfahrt;
};

export const getWings = (state: AbfahrtenState) => state.abfahrten.wings;
export const getAbfahrten = (state: AbfahrtenState) =>
  state.abfahrten.abfahrten;
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
  state => state.abfahrten.filterList,
  (abfahrten, onlyDepartures, selectedDetail, filterList) => {
    if (!abfahrten) return abfahrten;
    let filtered = abfahrten;

    if (onlyDepartures) {
      filtered = filtered.filter(a => a.departure || a.id === selectedDetail);
    }
    if (filterList.length) {
      filtered = filtered.filter(a => !filterList.includes(a.trainType));
    }

    return filtered;
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

const defaultTypes = ['ICE', 'IC', 'RE', 'RB', 'S'];

export const getAllTrainTypes = createSelector(
  getAbfahrten,
  abfahrten => {
    const typeSet = new Set<string>(defaultTypes);

    if (abfahrten) {
      abfahrten.forEach(a => {
        typeSet.add(a.trainType);
      });
    }

    return [...typeSet].filter(Boolean);
  }
);
