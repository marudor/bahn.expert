// @flow
import { createAction } from 'redux-actions';

export const TIME_CONFIG_KEY = 'TIME_CONFIG';
export const SEARCHTYPE_CONFIG_KEY = 'SEARCH_TYPE';

export const setTime = createAction('SET_TIME', timeConfig => {
  if (timeConfig) {
    localStorage.removeItem(TIME_CONFIG_KEY);
  } else {
    localStorage.setItem(TIME_CONFIG_KEY, '1');
  }

  return timeConfig;
});

export const setSearchType = createAction('SET_SERACH_TYPE', searchType => {
  if (searchType) {
    localStorage.setItem(SEARCHTYPE_CONFIG_KEY, searchType);
  } else {
    localStorage.removeItem(SEARCHTYPE_CONFIG_KEY);
  }
  return searchType;
});

export const setSettings = createAction('SET_SETTINGS');
export const openSettings = () => setSettings(true);
export const closeSettings = () => setSettings(false);
