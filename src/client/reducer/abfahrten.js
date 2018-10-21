// @flow
import * as Actions from 'client/actions/abfahrten';
import { combineActions, handleActions } from 'redux-actions';
import type { Abfahrt, Station } from 'types/abfahrten';

export type State = {
  selectedDetail: ?string,
  abfahrten: Array<Abfahrt>,
  currentStation: ?Station,
  error: ?Error,
};

const defaultState = {
  selectedDetail: localStorage.getItem('selectedDetail'),
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
            abfahrten: [],
            error: payload,
          }
        : {
            ...state,
            currentStation: payload.station,
            abfahrten: payload.abfahrten,
            error: null,
          },
    [String(Actions.setDetail)]: (state: State, { payload }) => {
      const selectedDetail: ?string = state.selectedDetail === payload ? null : payload;

      if (selectedDetail) {
        localStorage.setItem('selectedDetail', selectedDetail);
      } else {
        localStorage.removeItem('selectedDetail');
      }

      return {
        ...state,
        selectedDetail,
      };
    },
    [String(Actions.setCurrentStation)]: (state: State, { payload }) => ({
      ...state,
      currentStation: payload,
    }),
  },
  defaultState
);
