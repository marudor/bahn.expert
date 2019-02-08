// @flow
import { Actions } from 'client/actions/abfahrten';
import { type ActionType, handleActions } from 'redux-actions';
import type { Abfahrt, Station } from 'types/abfahrten';

export type State = {
  selectedDetail: ?string,
  abfahrten: ?Array<Abfahrt>,
  currentStation: ?Station,
  error: ?(Error & { station?: string }),
};

const defaultState = {
  selectedDetail: localStorage.getItem('selectedDetail'),
  abfahrten: null,
  currentStation: null,
  error: null,
};

export default handleActions<State, *>(
  {
    [String(Actions.gotAbfahrten)]: (state: State, { payload }: ActionType<typeof Actions.gotAbfahrten>) => ({
      ...state,
      currentStation: payload.station,
      abfahrten: payload.abfahrten,
      error: null,
    }),
    [String(Actions.gotAbfahrtenError)]: (state: State, { payload }: ActionType<typeof Actions.gotAbfahrtenError>) => ({
      ...state,
      abfahrten: [],
      error: payload,
    }),
    [String(Actions.setDetail)]: (state: State, { payload }: ActionType<typeof Actions.setDetail>) => ({
      ...state,
      selectedDetail: payload,
    }),
    [String(Actions.setCurrentStation)]: (state: State, { payload }: ActionType<typeof Actions.setCurrentStation>) => ({
      ...state,
      currentStation: payload,
      abfahrten: null,
    }),
  },
  defaultState
);
