// @flow
import { createAction } from 'redux-actions';
import axios from 'axios';
import type { Route } from 'types/routing';
import type { RoutingThunkAction } from 'AppState';

const Actions = {
  gotRoutes: createAction<string, ?Array<Route>>('GOT_ROUTES'),
  setDetail: createAction<string, ?string>('SET_DETAIL'),
};

export const getRoutes: RoutingThunkAction<?string, ?string> = (start, destination) => async dispatch => {
  const route = (await axios.post('/api/route', {
    start,
    destination,
    time: new Date().getTime(),
  })).data;

  dispatch(Actions.gotRoutes(route));
};

export default Actions;
