// @flow
import { Actions } from 'client/actions/config';
import { type ActionType, handleActions } from 'redux-actions';

export type State = {|
  time: boolean,
  open: boolean,
  searchType: string,
  traewelling: boolean,
  zoomReihung: boolean,
  useOwnAbfahrten: boolean,
  showSupersededMessages: boolean,
|};

let defaultState: State = {
  searchType: '',
  time: true,
  open: false,
  traewelling: false,
  zoomReihung: true,
  useOwnAbfahrten: false,
  showSupersededMessages: false,
};
const rawConfig = localStorage.getItem('config');

if (rawConfig) {
  try {
    defaultState = {
      ...defaultState,
      ...JSON.parse(rawConfig),
      open: false,
    };
  } catch (e) {
    // We ignore fails here
  }
}

localStorage.setItem('config', JSON.stringify(defaultState));

export default handleActions<State, *>(
  {
    [String(Actions.setConfig)]: (state: State, { payload: { key, value } }: ActionType<typeof Actions.setConfig>) => {
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
