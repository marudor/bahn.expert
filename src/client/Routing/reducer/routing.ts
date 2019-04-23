import { createReducer } from 'deox';
import { Route } from 'types/routing';
import Actions from 'Routing/actions/routing';

export type State = {
  routes?: Array<Route>;
};

const defaultState: State = {
  routes: [],
};

export default createReducer(defaultState, handle => [
  handle(Actions.gotRoutes, (state, { payload }) => ({
    ...state,
    routes: payload,
    selectedDetail: undefined,
  })),
]);
