import { createReducer } from 'deox';
import { Route, RoutingResult } from 'types/routing';
import Actions from 'Routing/actions/routing';

export type State = {
  routes?: Array<Route>;
  context: Partial<RoutingResult['context']>;
  error?: any;
};

const defaultState: State = {
  routes: [],
  context: {},
};

export default createReducer(defaultState, handle => [
  handle(Actions.gotRoutes, (state, { payload }) => ({
    ...state,
    routes: payload,
    error: undefined,
    selectedDetail: undefined,
  })),
  handle(Actions.gotEarlierContext, (state, { payload }) => ({
    ...state,
    context: {
      ...state.context,
      earlier: payload,
    },
  })),
  handle(Actions.gotLaterContext, (state, { payload }) => ({
    ...state,
    context: {
      ...state.context,
      later: payload,
    },
  })),
  handle(Actions.routesErrored, (state, { payload }) => ({
    ...state,
    routes: [],
    error: payload,
  })),
]);
