// @flow
import * as Actions from 'actions/config';
import { handleActions } from 'redux-actions';

export const TIME_OLD_DELAY = 0;
export const TIME_NEW_TIME = 1;
export type TimeConfig = 0 | 1;
export type State = {
  time: TimeConfig,
  open: boolean,
};

// $FlowFixMe we ignore type constraints here
const savedTimeConfig: TimeConfig = Number.parseInt(localStorage.getItem(Actions.TIME_CONFIG_KEY), 10);

const defaultState: State = {
  time: Number.isInteger(savedTimeConfig) ? savedTimeConfig : TIME_NEW_TIME,
  open: false,
};

export default handleActions(
  {
    [String(Actions.setTime)]: (state: State, { payload }: { payload: TimeConfig }) => ({
      ...state,
      time: payload,
    }),
    [String(Actions.setSettings)]: (state: State, { payload }: { payload: boolean }) => ({
      ...state,
      open: payload,
    }),
  },
  defaultState
);
