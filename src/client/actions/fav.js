// @flow
import { createAction } from 'redux-actions';
import { setCookieOptions } from 'client/util';
import type { Station } from 'types/abfahrten';
import type { ThunkAction } from 'AppState';

// eslint-disable-next-line import/prefer-default-export
export const Actions = {
  setFavs: createAction<string, { [key: string | number]: Station }>('SET_FAVS'),
};

export const fav: ThunkAction<Station> = station => (dispatch, getState) => {
  const state = getState();
  const favs = {
    ...state.fav.favs,
    [station.id]: station,
  };

  dispatch(Actions.setFavs(favs));
  state.config.cookies.set('favs', favs, setCookieOptions);

  return Promise.resolve();
};

export const unfav: ThunkAction<Station> = station => (dispatch, getState) => {
  const state = getState();
  const favs = { ...state.fav.favs };

  delete favs[station.id];
  dispatch(Actions.setFavs(favs));
  state.config.cookies.set('favs', favs, setCookieOptions);

  return Promise.resolve();
};
