// @flow
import * as Actions from 'actions/fav';
import { handleActions } from 'redux-actions';
import { Map } from 'immutable';
import type { Station } from 'types/abfahrten';

export type State = {
  favs: Map<string | number, Station>,
};

let initialFavs;

try {
  const rawFavs: Object = JSON.parse(localStorage.getItem('favs') || '{}');

  if (typeof rawFavs === 'object') {
    const keys = Object.keys(rawFavs);

    keys.forEach(k => {
      if (typeof k !== 'string') {
        throw new Error();
      }
      const val = (rawFavs: any)[k];

      if (typeof val !== 'object' || !('id' in val) || !('title' in val)) {
        throw new Error();
      }
    });
  }
  initialFavs = Map(rawFavs);
} catch (e) {
  initialFavs = Map({});
}

const defaultState = {
  favs: initialFavs,
};

export default handleActions(
  {
    [String(Actions.fav)]: (state: State, { payload }) => {
      const favs = state.favs.set(payload.id, payload);

      localStorage.setItem('favs', JSON.stringify(favs));

      return {
        ...state,
        favs,
      };
    },
    [String(Actions.unfav)]: (state: State, { payload }) => {
      const favs = state.favs.remove(payload.id);

      localStorage.setItem('favs', JSON.stringify(favs));

      return {
        ...state,
        favs,
      };
    },
  },
  defaultState
);
