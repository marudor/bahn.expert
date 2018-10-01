// @flow
import { createAction } from 'redux-actions';

export const TIME_CONFIG_KEY = 'TIME_CONFIG';
export const SEARCHTYPE_CONFIG_KEY = 'SEARCH_TYPE';

export const setConfig = createAction('SET_CONFIG');
export const setSearchType = (value: string) =>
  setConfig({
    key: 'searchType',
    value,
  });
export const setTime = (value: boolean) =>
  setConfig({
    key: 'time',
    value,
  });
export const setTraewelling = (value: boolean) =>
  setConfig({
    key: 'traewelling',
    value,
  });

export const openSettings = () =>
  setConfig({
    key: 'open',
    value: true,
  });
export const closeSettings = () =>
  setConfig({
    key: 'open',
    value: false,
  });
