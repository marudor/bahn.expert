// @flow
import * as Actions from 'actions/abfahrten';
import { combineActions, handleActions } from 'redux-actions';
import { List } from 'immutable';
import type { Abfahrt, Station } from 'types/abfahrten';

export type State = {
  selectedDetail: ?string,
  abfahrten: List<Abfahrt>,
  currentStation: ?Station,
  error: ?Error,
};

const defaultState = {
  selectedDetail: null,
  abfahrten: List(),
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
            abfahrten: List(),
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
