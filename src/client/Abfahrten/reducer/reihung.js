// @flow
import { type ActionType, handleActions } from 'redux-actions';
import Actions from 'Abfahrten/actions/reihung';
import type { Reihung } from 'types/reihung';

export type State = {
  reihung: { [key: string]: ?Reihung },
};

const defaultState: State = {
  reihung: {},
};

export default handleActions<State, *>(
  {
    [String(Actions.gotReihung)]: (
      state: State,
      { payload }: ActionType<typeof Actions.gotReihung>
    ) => ({
      ...state,
      reihung: {
        ...state.reihung,
        [payload.id]: payload.data,
      },
    }),
  },
  defaultState
);
