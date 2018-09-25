// @flow
import * as Actions from 'client/actions/auslastung';
import { handleActions } from 'redux-actions';
import type { Auslastung } from 'types/auslastung';

export type State = {
  auslastung: { [key: number]: Auslastung },
};

const defaultState: State = {
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
