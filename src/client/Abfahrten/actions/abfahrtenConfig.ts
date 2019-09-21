import { AbfahrtenThunkResult } from 'AppState';
import { AllowedStationAPIs } from 'types/api/station';
import { CheckInType, MarudorConfig } from 'Common/config';
import { createAction } from 'deox';
import { defaultConfig, setCookieOptions } from 'client/util';
import abfahrtenActions from './abfahrten';
import Cookies from 'universal-cookie';

export const TIME_CONFIG_KEY = 'TIME_CONFIG';
export const SEARCHTYPE_CONFIG_KEY = 'SEARCH_TYPE';

const Actions = {
  setConfig: createAction('SET_CONFIG', resolve => (c: MarudorConfig) =>
    resolve(c)
  ),
  setMenu: createAction('SET_MENU', resolve => (c: boolean) => resolve(c)),
};

export default Actions;

export const setSearchType = (value: AllowedStationAPIs, cookies: Cookies) =>
  setConfig('searchType', value, undefined, cookies);
export const setTime = (value: boolean, cookies: Cookies) =>
  setConfig('time', value, undefined, cookies);
export const setZoomReihung = (value: boolean, cookies: Cookies) =>
  setConfig('zoomReihung', value, undefined, cookies);
export const setShowSupersededMessages = (value: boolean, cookies: Cookies) =>
  setConfig('showSupersededMessages', value, undefined, cookies);
export const setLookahead = (value: string, cookies: Cookies) =>
  setConfig('lookahead', value, undefined, cookies);
export const setLookbehind = (value: string, cookies: Cookies) =>
  setConfig('lookbehind', value, undefined, cookies);
export const setFahrzeugGruppe = (value: boolean, cookies: Cookies) =>
  setConfig('fahrzeugGruppe', value, undefined, cookies);
export const setLineAndNumber = (value: boolean, cookies: Cookies) =>
  setConfig('lineAndNumber', value, undefined, cookies);
export const setAutoUpdate = (value: number, cookies: Cookies) =>
  setConfig('autoUpdate', value, undefined, cookies);

export const openSettings = () => Actions.setMenu(true);
export const closeSettings = () => Actions.setMenu(false);

export const setCheckIn = (value: CheckInType, cookies: Cookies) =>
  setConfig('checkIn', value, undefined, cookies);

export const setFromCookies = (
  cookies: Cookies
): AbfahrtenThunkResult => dispatch => {
  const defaultFilter = cookies.get('defaultFilter');

  const config: MarudorConfig = {
    ...defaultConfig,
    ...cookies.get('config'),
  };

  dispatch(Actions.setConfig(config));

  dispatch(
    abfahrtenActions.setFilterList(
      Array.isArray(defaultFilter) ? defaultFilter : []
    )
  );
  dispatch(abfahrtenActions.setDetail(cookies.get('selectedDetail')));
};

export const setConfig = <K extends keyof MarudorConfig>(
  key: K,
  value: MarudorConfig[K],
  temp: boolean = false,
  cookies: Cookies
): AbfahrtenThunkResult => (dispatch, getState) => {
  const oldConfig = getState().abfahrtenConfig.config;
  const newConfig = {
    ...oldConfig,
    [key]: value,
  };

  if (!temp) {
    cookies.set('config', newConfig, setCookieOptions);
  }

  dispatch(Actions.setConfig(newConfig));
};

export const setDefaultFilter = (cookies: Cookies): AbfahrtenThunkResult => (
  _,
  getState
) => {
  const filterList = getState().abfahrten.filterList;

  cookies.set('defaultFilter', filterList, setCookieOptions);
};
