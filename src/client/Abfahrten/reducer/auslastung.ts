import { Auslastung } from 'types/auslastung';
import { createReducer } from 'deox';
import Actions from 'Abfahrten/actions/auslastung';

export type State = {
  auslastung: { [key: string]: null | undefined | Auslastung };
};

const defaultState: State = {
  auslastung: {},
};

export default createReducer(defaultState, handle => [
  handle(Actions.gotAuslastung, (state, { payload }) => ({
    ...state,
    auslastung: {
      ...state.auslastung,
      [payload.id]: payload.data,
    },
  })),
]);
