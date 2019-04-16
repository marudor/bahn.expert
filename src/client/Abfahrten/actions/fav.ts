import { AbfahrtenThunkResult } from 'AppState';
import { createAction } from 'deox';
import { setCookieOptions } from 'client/util';
import { Station } from 'types/station';

// eslint-disable-next-line import/prefer-default-export
const Actions = {
  setFavs: createAction(
    'SET_FAVS',
    resolve => (c: { [key: string]: Station }) => resolve(c)
  ),
};

export default Actions;

export const fav = (station: Station): AbfahrtenThunkResult => (
  dispatch,
  getState
) => {
  const state = getState();
  const favs = {
    ...state.fav.favs,
    [station.id]: station,
  };

  dispatch(Actions.setFavs(favs));
  state.config.cookies.set('favs', favs, setCookieOptions);
};

export const unfav = (station: Station): AbfahrtenThunkResult => (
  dispatch,
  getState
) => {
  const state = getState();
  const favs = { ...state.fav.favs };

  delete favs[station.id];
  dispatch(Actions.setFavs(favs));
  state.config.cookies.set('favs', favs, setCookieOptions);
};
