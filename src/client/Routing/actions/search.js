// @flow
import { createAction } from 'redux-actions';
import { getStationsFromAPI } from 'Common/service/stationSearch';
import type { RoutingThunkAction } from 'AppState';
import type { Station } from 'types/station';

const Actions = {
  setStart: createAction<string, ?Station>('SET_START'),
  setDestination: createAction<string, ?Station>('SET_DESTINATION'),
  setDate: createAction<string, Date>('SET_DATE'),
};

type AllowedSetStationActions =
  | typeof Actions.setStart
  | typeof Actions.setDestination;
export const getStationById: RoutingThunkAction<
  string,
  AllowedSetStationActions
> = (stationId, action) => async dispatch => {
  const stations = await getStationsFromAPI(stationId, 'dbNav');

  dispatch(action(stations[0]));
};

export default Actions;
