import { AbfahrtenState } from 'AppState';
import { createSelector } from 'reselect';

export const getAbfahrten = (state: AbfahrtenState) =>
  state.abfahrten.departures;

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
