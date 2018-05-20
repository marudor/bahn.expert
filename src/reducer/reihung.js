// @flow
import * as Actions from 'actions/reihung';
import { handleActions } from 'redux-actions';
import type { Reihung } from 'types/reihung';

export type State = {
  reihung: { [key: string]: ?Reihung },
};

const defaultState: State = {
  reihung: {},
};

export default handleActions(
  {
    [String(Actions.getReihung)]: (state: State, { payload, error }) =>
      error
        ? state
        : {
            ...state,
            reihung: {
              ...state.reihung,
              [payload.id]: payload.data,
            },
          },
  },
  defaultState
);
