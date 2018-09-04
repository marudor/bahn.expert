// @flow
import * as Actions from 'actions/config';
import { handleActions } from 'redux-actions';

export type State = {
  time: boolean,
  open: boolean,
  searchType: string,
};

const savedTimeConfig: boolean = !Boolean(localStorage.getItem(Actions.TIME_CONFIG_KEY));
const savedSearchType = localStorage.getItem(Actions.SEARCHTYPE_CONFIG_KEY) || '';

const defaultState: State = {
  searchType: savedSearchType,
  time: savedTimeConfig,
  open: false,
};

export default handleActions(
  {
    [String(Actions.setTime)]: (state: State, { payload }: { payload: boolean }) => ({
      ...state,
      time: payload,
    }),
    [String(Actions.setSettings)]: (state: State, { payload }: { payload: boolean }) => ({
      ...state,
      open: payload,
    }),
    [String(Actions.setSearchType)]: (state: State, { payload }: { payload: string }) => ({
      ...state,
      searchType: payload,
    }),
  },
  defaultState
);
