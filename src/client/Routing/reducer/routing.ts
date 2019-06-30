import { createReducer } from 'deox';
import { Route, RoutingResult } from 'types/routing';
import Actions from 'Routing/actions/routing';

export interface RoutingSettings {
  maxChanges: string;
  transferTime: string;
  searchForDeparture?: boolean;
}

export type State = {
  routes?: Route[];
  context: Partial<RoutingResult['context']>;
  error?: any;
  settings: RoutingSettings;
};

const defaultState: State = {
  routes: [],
  context: {},
  settings: {
    maxChanges: '-1',
    transferTime: '0',
  },
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
  handle(Actions.setSetting, (state, { payload: { key, value } }) => ({
    ...state,
    settings: {
      ...state.settings,
      [key]: value,
    },
  })),
]);
