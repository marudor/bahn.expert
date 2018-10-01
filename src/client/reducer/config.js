// @flow
import * as Actions from 'client/actions/config';
import { handleActions } from 'redux-actions';

export type State = {|
  time: boolean,
  open: boolean,
  searchType: string,
  traewelling: boolean,
|};

// This is migration, remvoe this soonish
const savedTimeConfig: boolean = !localStorage.getItem(Actions.TIME_CONFIG_KEY);
const savedSearchType = localStorage.getItem(Actions.SEARCHTYPE_CONFIG_KEY) || '';

localStorage.removeItem(Actions.TIME_CONFIG_KEY);
localStorage.removeItem(Actions.SEARCHTYPE_CONFIG_KEY);
let defaultState: State = {
  searchType: savedSearchType,
  time: savedTimeConfig,
  open: false,
  traewelling: false,
};
const rawConfig = localStorage.getItem('config');

if (rawConfig) {
  try {
    defaultState = {
      ...JSON.parse(rawConfig),
      open: false,
    };
  } catch (e) {
    // We ignore fails here
  }
}

localStorage.setItem('config', JSON.stringify(defaultState));

export default handleActions(
  {
    [String(Actions.setConfig)]: (
      state: State,
      { payload: { key, value } }: { payload: { key: string, value: any } }
    ) => {
      const newState = {
        ...state,
        [key]: value,
      };

      localStorage.setItem('config', JSON.stringify(newState));

      return newState;
    },
  },
  defaultState
);
