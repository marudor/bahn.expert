// @flow
import { createAction } from 'redux-actions';
import abfahrtenActions from './abfahrten';
import favActions from './fav';
import type { AbfahrtenThunkAction } from 'AppState';
import type Cookies from 'universal-cookie';

export const TIME_CONFIG_KEY = 'TIME_CONFIG';
export const SEARCHTYPE_CONFIG_KEY = 'SEARCH_TYPE';

const Actions = {
  setConfig: createAction<
    string,
    {
      key: $Keys<marudorConfig>,
      value: $Values<marudorConfig>,
    }
  >('SET_CONFIG'),
  setCookies: createAction<string, Cookies>('SET_COOKIES'),
  setMenu: createAction<string, boolean>('SET_MENU'),
  setBaseUrl: createAction<string, string>('SET_BASE_URL'),
};

export default Actions;

export const setSearchType = (value: string) =>
  Actions.setConfig({
    key: 'searchType',
    value,
  });
export const setTime = (value: boolean) => Actions.setConfig({ key: 'time', value });
export const setZoomReihung = (value: boolean) => Actions.setConfig({ key: 'zoomReihung', value });
export const setShowSupersededMessages = (value: boolean) =>
  Actions.setConfig({ key: 'showSupersededMessages', value }, value);
export const setLookahead = (value: string) => Actions.setConfig({ key: 'lookahead', value });
export const setFahrzeugGruppe = (value: boolean) => Actions.setConfig({ key: 'fahrzeugGruppe', value });
export const setLineAndNumber = (value: boolean) => Actions.setConfig({ key: 'lineAndNumber', value });

export const openSettings = () => Actions.setMenu(true);
export const closeSettings = () => Actions.setMenu(false);

export const setCheckIn: AbfahrtenThunkAction<string> = value => dispatch => {
  dispatch(Actions.setConfig({ key: 'checkIn', value }));
  // $FlowFixMe - migration
  dispatch(Actions.setConfig({ key: 'traewelling', value: null }));

  return Promise.resolve();
};

export const setCookies: AbfahrtenThunkAction<Cookies> = cookies => dispatch => {
  dispatch(Actions.setCookies(cookies));
  dispatch(favActions.setFavs(cookies.get('favs') || {}));
  dispatch(abfahrtenActions.setDetail(cookies.get('selectedDetail')));

  return Promise.resolve();
};
