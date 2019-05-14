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
  props.abfahrt.arrival && props.abfahrt.arrival.wingIds;
export const getDepartureWingIdsFromProps = (_: any, props: AbfahrtProps) =>
  props.abfahrt.departure && props.abfahrt.departure.wingIds;
export const getIdFromProps = (_: any, props: AbfahrtProps) => props.abfahrt.id;

export const getAbfahrtenForConfig = createSelector(
  (state: AbfahrtenState) => state.abfahrten.departures,
  state => state.abfahrten.filterList,
  (abfahrten, filterList) => {
    if (!abfahrten) return abfahrten;
    const filtered = {
      lookahead: abfahrten.lookahead,
      lookbehind: abfahrten.lookbehind,
    };

    if (filterList.length) {
      const f = (a: Abfahrt) => !filterList.includes(a.train.type);

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
        typeSet.add(a.train.type);
      });
      abfahrten.lookbehind.forEach(a => {
        typeSet.add(a.train.type);
      });
    }

    return [...typeSet].filter(Boolean);
  }
);
