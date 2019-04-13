// @flow
import { type ActionType, handleActions } from 'redux-actions';
import Actions from 'Routing/actions/routing';
import type { Route } from 'types/routing';

export type State = {
  routes?: Array<Route>,
};

const defaultState: State = {};

export default handleActions<State, *>(
  {
    [String(Actions.gotRoutes)]: (
      state: State,
      { payload }: ActionType<typeof Actions.gotRoutes>
    ) => ({
      ...state,
      routes: payload,
      selectedDetail: undefined,
    }),
  },
  defaultState
);
