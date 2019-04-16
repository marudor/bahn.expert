import { createAction } from 'deox';
import { Route } from 'types/routing';
import { RoutingThunkResult } from 'AppState';
import axios from 'axios';

const Actions = {
  gotRoutes: createAction('GOT_ROUTES', resolve => (r?: Array<Route>) =>
    resolve(r)
  ),
};

export const getRoutes = (
  start: string,
  destination: string,
  date: Date
): RoutingThunkResult => async dispatch => {
  const route = (await axios.post('/api/route', {
    start,
    destination,
    time: date.getTime(),
  })).data;

  dispatch(Actions.gotRoutes(route));
};

export default Actions;
