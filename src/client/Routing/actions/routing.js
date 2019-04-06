// @flow
import { createAction } from 'redux-actions';
import { getStationsFromAPI } from 'Common/service/stationSearch';
import axios from 'axios';
import type { Route } from 'types/routing';
import type { RoutingThunkAction } from 'AppState';
import type { Station } from 'types/station';

const Actions = {
  setStart: createAction<string, ?Station>('SET_START'),
  setDestination: createAction<string, ?Station>('SET_DESTINATION'),
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

type AllowedSetStationActions = typeof Actions.setStart | typeof Actions.setDestination;
export const getStationById: RoutingThunkAction<string, AllowedSetStationActions> = (
  stationId,
  action
) => async dispatch => {
  const stations = await getStationsFromAPI(stationId, 'dbNav');

  dispatch(action(stations[0]));
};

export default Actions;
