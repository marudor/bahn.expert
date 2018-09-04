// @flow
import { createAction } from 'redux-actions';

export const TIME_CONFIG_KEY = 'TIME_CONFIG';

export const setTime = createAction('SET_TIME', timeConfig => {
  if (timeConfig) {
    localStorage.removeItem(TIME_CONFIG_KEY);
  } else {
    localStorage.setItem(TIME_CONFIG_KEY, '1');
  }

  return timeConfig;
});

export const setSettings = createAction('SET_SETTINGS');
export const openSettings = () => setSettings(true);
export const closeSettings = () => setSettings(false);
