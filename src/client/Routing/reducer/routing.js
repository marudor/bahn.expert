// @flow
import { type ActionType, handleActions } from 'redux-actions';
import Actions from 'Routing/actions/routing';
import type { Route } from 'types/routing';

export type State = {
  routes?: Array<Route>,
  selectedDetail?: ?string,
};

const defaultState: State = {
  selectedDetail: localStorage.getItem('RselectedDetail'),
};

export default handleActions<State, *>(
  {
    [String(Actions.gotRoutes)]: (
      state: State,
      { payload }: ActionType<typeof Actions.gotRoutes>
    ) => ({
      ...state,
      routes: payload,
    }),
    [String(Actions.setDetail)]: (
      state: State,
      { payload }: ActionType<typeof Actions.setDetail>
    ) => ({
      ...state,
      selectedDetail: payload,
    }),
  },
  defaultState
);
