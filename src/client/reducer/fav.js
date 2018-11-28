// @flow
import { Actions } from 'client/actions/fav';
import { type ActionType, handleActions } from 'redux-actions';
import type { Station } from 'types/abfahrten';

export type State = {
  favs: { [key: string | number]: Station },
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
  initialFavs = rawFavs;
} catch (e) {
  initialFavs = {};
}

const defaultState = {
  favs: initialFavs,
};

export default handleActions<State, *>(
  {
    [String(Actions.fav)]: (state: State, { payload }: ActionType<typeof Actions.fav>) => {
      const favs = {
        ...state.favs,
        [payload.id]: payload,
      };

      localStorage.setItem('favs', JSON.stringify(favs));

      return {
        ...state,
        favs,
      };
    },
    [String(Actions.unfav)]: (state: State, { payload }: ActionType<typeof Actions.unfav>) => {
      // eslint-disable-next-line no-unused-vars
      delete state.favs[payload.id];
      // Create new Object for immutability
      const favs = { ...state.favs };

      localStorage.setItem('favs', JSON.stringify(favs));

      return {
        ...state,
        favs,
      };
    },
  },
  defaultState
);
