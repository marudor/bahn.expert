import { createReducer } from 'deox';
import { Route$Auslastung } from 'types/routing';
import Actions from 'Abfahrten/actions/auslastung';

export type State = {
  auslastung: { [key: string]: null | undefined | Route$Auslastung };
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
