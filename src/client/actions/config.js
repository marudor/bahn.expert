// @flow
import { Actions as abfahrtenActions } from './abfahrten';
import { createAction } from 'redux-actions';
import { Actions as favActions } from './fav';
import type { ThunkAction } from 'AppState';
import type Cookies from 'universal-cookie';

export const TIME_CONFIG_KEY = 'TIME_CONFIG';
export const SEARCHTYPE_CONFIG_KEY = 'SEARCH_TYPE';

export const Actions = {
  setConfig: createAction<
    string,
    {
      key: string,
      value: any,
    }
  >('SET_CONFIG'),
  setCookies: createAction<string, Cookies>('SET_COOKIES'),
  setMenu: createAction<string, boolean>('SET_MENU'),
};

export const setSearchType = (value: string) =>
  Actions.setConfig({
    key: 'searchType',
    value,
  });
export const setTime = (value: boolean) => Actions.setConfig({ key: 'time', value });
export const setTraewelling = (value: boolean) => Actions.setConfig({ key: 'traewelling', value });
export const setZoomReihung = (value: boolean) => Actions.setConfig({ key: 'zoomReihung', value });
export const setShowSupersededMessages = (value: boolean) =>
  Actions.setConfig({ key: 'showSupersededMessages', value }, value);
export const setLookahead = (value: string) => Actions.setConfig({ key: 'lookahead', value });
export const setFahrzeugGruppe = (value: boolean) => Actions.setConfig({ key: 'fahrzeugGruppe', value });

export const openSettings = () => Actions.setMenu(true);
export const closeSettings = () => Actions.setMenu(false);

export const setCookies: ThunkAction<Cookies> = cookies => dispatch => {
  dispatch(Actions.setCookies(cookies));
  dispatch(favActions.setFavs(cookies.get('favs') || {}));
  dispatch(abfahrtenActions.setDetail(cookies.get('selectedDetail')));

  return Promise.resolve();
};
