import { Abfahrt } from 'types/abfahrten';
import { AbfahrtenState } from 'AppState';
import { createSelector } from 'reselect';

type AbfahrtProps = {
  abfahrt: Abfahrt;
};

export const getWings = (state: AbfahrtenState) => state.abfahrten.wings;
export const getAbfahrten = (state: AbfahrtenState) =>
  state.abfahrten.departures;
export const getSelectedDetail = (state: AbfahrtenState) =>
  state.abfahrten.selectedDetail;
export const getArrivalWingIdsFromProps = (_: any, props: AbfahrtProps) =>
  props.abfahrt.arrivalWingIds;
export const getDepartureWingIdsFromProps = (_: any, props: AbfahrtProps) =>
  props.abfahrt.departureWingIds;
export const getIdFromProps = (_: any, props: AbfahrtProps) => props.abfahrt.id;
export const getNextDeparture = (state: AbfahrtenState) => {
  if (state.abfahrten.departures) {
    return state.abfahrten.departures.lookahead.find(a =>
      Boolean(a.scheduledDeparture)
    );
  }
};

export const getAbfahrtenForConfig = createSelector(
  (state: AbfahrtenState) => state.abfahrten.departures,
  state => state.abfahrten.selectedDetail,
  state => state.abfahrten.filterList,
  (abfahrten, selectedDetail, filterList) => {
    if (!abfahrten) return abfahrten;
    const filtered = {
      lookahead: abfahrten.lookahead,
      lookbehind: abfahrten.lookbehind,
    };

    if (filterList.length) {
      const f = (a: Abfahrt) => !filterList.includes(a.trainType);

      filtered.lookahead = filtered.lookahead.filter(f);
      filtered.lookbehind = filtered.lookbehind.filter(f);
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

const defaultTypes = ['ICE', 'IC', 'EC', 'RE', 'RB', 'S'];

export const getAllTrainTypes = createSelector(
  getAbfahrten,
  abfahrten => {
    const typeSet = new Set<string>(defaultTypes);

    if (abfahrten) {
      abfahrten.lookahead.forEach(a => {
        typeSet.add(a.trainType);
      });
      abfahrten.lookbehind.forEach(a => {
        typeSet.add(a.trainType);
      });
    }

    return [...typeSet].filter(Boolean);
  }
);
