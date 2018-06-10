// @flow
import * as Actions from 'actions/abfahrten';
import { combineActions, handleActions } from 'redux-actions';
import type { Abfahrt, Station } from 'types/abfahrten';

export type State = {
  selectedDetail: ?string,
  abfahrten: Array<Abfahrt>,
  currentStation: ?Station,
  error: ?Error,
};

const defaultState = {
  selectedDetail: null,
  abfahrten: [],
  currentStation: null,
  error: null,
};

export default handleActions(
  {
    [combineActions(Actions.getAbfahrtenByStation, Actions.getAbfahrtenByString)]: (state: State, { payload, error }) =>
      error
        ? {
            ...state,
            currentStation: null,
            abfahrten: [],
            error: payload,
          }
        : {
            ...state,
            currentStation: payload.station,
            abfahrten: payload.abfahrten,
            error: null,
          },
    [String(Actions.setDetail)]: (state: State, { payload }) => ({
      ...state,
      selectedDetail: state.selectedDetail === payload ? null : payload,
    }),
    [String(Actions.setCurrentStation)]: (state: State, { payload }) => ({
      ...state,
      currentStation: payload,
    }),
  },
  defaultState
);
