// @flow
import * as Actions from 'actions/abfahrten';
import { combineActions, handleActions } from 'redux-actions';
import { List } from 'immutable';
import type { Abfahrt, Station } from 'types/abfahrten';

export type State = {
  selectedDetail: ?string,
  abfahrten: List<Abfahrt>,
  currentStation: ?Station,
};

const defaultState = {
  selectedDetail: null,
  abfahrten: List(),
  currentStation: null,
};

export default handleActions(
  {
    [combineActions(Actions.getAbfahrtenByStation, Actions.getAbfahrtenByString)]: (state: State, { payload }) => ({
      ...state,
      currentStation: payload.station,
      abfahrten: payload.abfahrten,
    }),
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
