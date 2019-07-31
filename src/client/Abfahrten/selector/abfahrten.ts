import { Abfahrt } from 'types/abfahrten';
import { AbfahrtenState } from 'AppState';
import { createSelector } from 'reselect';

export const getAbfahrten = (state: AbfahrtenState) =>
  state.abfahrten.departures;

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
