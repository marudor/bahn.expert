import { AbfahrtenThunkResult } from 'AppState';
import { CheckInType, MarudorConfig, StationSearchType } from 'Common/config';
import { createAction } from 'deox';
import { setCookieOptions } from 'client/util';
import abfahrtenActions from './abfahrten';
import Cookies from 'universal-cookie';
import favActions from './fav';

export const TIME_CONFIG_KEY = 'TIME_CONFIG';
export const SEARCHTYPE_CONFIG_KEY = 'SEARCH_TYPE';

const Actions = {
  setConfig: createAction(
    'SET_CONFIG',
    resolve => <K extends keyof MarudorConfig>(c: {
      key: K;
      value: MarudorConfig[K];
    }) => resolve(c)
  ),
  setCookies: createAction('SET_COOKIES', resolve => (c: Cookies) =>
    resolve(c)
  ),
  setMenu: createAction('SET_MENU', resolve => (c: boolean) => resolve(c)),
  setBaseUrl: createAction('SET_BASE_URL', resolve => (c: string) =>
    resolve(c)
  ),
};

export default Actions;

export const setSearchType = (value: StationSearchType) =>
  Actions.setConfig({
    key: 'searchType',
    value,
  });
export const setTime = (value: boolean) =>
  Actions.setConfig({ key: 'time', value });
export const setZoomReihung = (value: boolean) =>
  Actions.setConfig({ key: 'zoomReihung', value });
export const setShowSupersededMessages = (value: boolean) =>
  Actions.setConfig({ key: 'showSupersededMessages', value });
export const setLookahead = (value: string) =>
  Actions.setConfig({ key: 'lookahead', value });
export const setLookbehind = (value: string) =>
  Actions.setConfig({ key: 'lookbehind', value });
export const setFahrzeugGruppe = (value: boolean) =>
  Actions.setConfig({ key: 'fahrzeugGruppe', value });
export const setLineAndNumber = (value: boolean) =>
  Actions.setConfig({ key: 'lineAndNumber', value });
export const setAutoUpdate = (value: number) =>
  Actions.setConfig({ key: 'autoUpdate', value });

export const openSettings = () => Actions.setMenu(true);
export const closeSettings = () => Actions.setMenu(false);

export const setCheckIn = (
  value: CheckInType
): AbfahrtenThunkResult => dispatch => {
  dispatch(Actions.setConfig({ key: 'checkIn', value }));
};

export const setCookies = (
  cookies: Cookies
): AbfahrtenThunkResult => dispatch => {
  dispatch(Actions.setCookies(cookies));
  dispatch(favActions.setFavs(cookies.get('favs') || {}));
  dispatch(abfahrtenActions.setFilterList(cookies.get('defaultFilter') || []));
  dispatch(abfahrtenActions.setDetail(cookies.get('selectedDetail')));
};

export const setDefaultFilter = (): AbfahrtenThunkResult => (
  dispatch,
  getState
) => {
  const cookies = getState().config.cookies;
  const filterList = getState().abfahrten.filterList;

  cookies.set('defaultFilter', filterList, setCookieOptions);
};
