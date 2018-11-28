// @flow
import { Actions } from 'client/actions/auslastung';
import { type ActionType, handleActions } from 'redux-actions';
import type { Auslastung } from 'types/auslastung';

export type State = {
  auslastung: { [key: string]: Auslastung },
};

const defaultState: State = {
  auslastung: {},
};

export default handleActions<State, *>(
  {
    [String(Actions.gotAuslastung)]: (state: State, { payload }: ActionType<typeof Actions.gotAuslastung>) => ({
      ...state,
      auslastung: {
        ...state.auslastung,
        [payload.id]: payload.data,
      },
    }),
  },
  defaultState
);
