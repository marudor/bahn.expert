// @flow
import * as Actions from 'actions/auslastung';
import { handleActions } from 'redux-actions';
import type { Auslastung } from 'types/auslastung';

export type State = {
  auslastung: { [key: string]: Auslastung },
};

const defaultState = {
  auslastung: {},
};

export default handleActions(
  {
    [String(Actions.getAuslastung)]: (state: State, { payload, error }) =>
      error
        ? state
        : {
            ...state,
            auslastung: {
              ...state.auslastung,
              [payload.id]: payload.data,
            },
          },
  },
  defaultState
);
