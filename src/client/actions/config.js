// @flow
import { createAction } from 'redux-actions';

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
};

export const setSearchType = (value: string) =>
  Actions.setConfig({
    key: 'searchType',
    value,
  });
export const setTime = (value: boolean) => Actions.setConfig({ key: 'time', value });
export const setTraewelling = (value: boolean) => Actions.setConfig({ key: 'traewelling', value });
export const setZoomReihung = (value: boolean) => Actions.setConfig({ key: 'zoomReihung', value });
export const setUseOwnAbfahrten = (value: boolean) => Actions.setConfig({ key: 'useOwnAbfahrten', value });
export const setShowSupersededMessages = (value: boolean) =>
  Actions.setConfig({ key: 'showSupersededMessages', value }, value);

export const openSettings = () => Actions.setConfig({ key: 'open', value: true });
export const closeSettings = () => Actions.setConfig({ key: 'open', value: false });
