import { AbfahrtenThunkResult } from 'AppState';
import { CheckInType, MarudorConfig, StationSearchType } from 'Common/config';
import { createAction } from 'deox';
import { defaultConfig, setCookieOptions } from 'client/util';
import abfahrtenActions from './abfahrten';
import favActions from './fav';

export const TIME_CONFIG_KEY = 'TIME_CONFIG';
export const SEARCHTYPE_CONFIG_KEY = 'SEARCH_TYPE';

const Actions = {
  setConfig: createAction('SET_CONFIG', resolve => (c: MarudorConfig) =>
    resolve(c)
  ),
  setMenu: createAction('SET_MENU', resolve => (c: boolean) => resolve(c)),
};

export default Actions;

export const setSearchType = (value: StationSearchType) =>
  setConfig('searchType', value);
export const setTime = (value: boolean) => setConfig('time', value);
export const setZoomReihung = (value: boolean) =>
  setConfig('zoomReihung', value);
export const setShowSupersededMessages = (value: boolean) =>
  setConfig('showSupersededMessages', value);
export const setLookahead = (value: string) => setConfig('lookahead', value);
export const setLookbehind = (value: string) => setConfig('lookbehind', value);
export const setFahrzeugGruppe = (value: boolean) =>
  setConfig('fahrzeugGruppe', value);
export const setLineAndNumber = (value: boolean) =>
  setConfig('lineAndNumber', value);
export const setAutoUpdate = (value: number) => setConfig('autoUpdate', value);

export const openSettings = () => Actions.setMenu(true);
export const closeSettings = () => Actions.setMenu(false);

export const setCheckIn = (value: CheckInType) => setConfig('checkIn', value);

export const setFromCookies = (): AbfahrtenThunkResult => (
  dispatch,
  getState
) => {
  const cookies = getState().config.cookies;

  dispatch(favActions.setFavs(cookies.get('favs') || {}));
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
  temp: boolean = false
): AbfahrtenThunkResult => (dispatch, getState) => {
  const oldConfig = getState().abfahrtenConfig.config;
  const cookies = getState().config.cookies;
  const newConfig = {
    ...oldConfig,
    [key]: value,
  };

  if (!temp) {
    cookies.set('config', newConfig, setCookieOptions);
  }

  dispatch(Actions.setConfig(newConfig));
};

export const setDefaultFilter = (): AbfahrtenThunkResult => (_, getState) => {
  const cookies = getState().config.cookies;
  const filterList = getState().abfahrten.filterList;

  cookies.set('defaultFilter', filterList, setCookieOptions);
};
