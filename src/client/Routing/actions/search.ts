import { createAction } from 'deox';
import { getStationsFromAPI } from 'Common/service/stationSearch';
import { RoutingThunkResult } from 'AppState';
import { Station } from 'types/station';
import { StationSearchType } from 'Common/config';

const Actions = {
  setStart: createAction('SET_START', resolve => (s?: Station) => resolve(s)),
  setDestination: createAction('SET_DESTINATION', resolve => (s?: Station) =>
    resolve(s)
  ),
  setDate: createAction('SET_DATE', resolve => (d: Date) => resolve(d)),
};

type AllowedSetStationActions =
  | typeof Actions.setStart
  | typeof Actions.setDestination;
export const getStationById = (
  stationId: string,
  action: AllowedSetStationActions
): RoutingThunkResult => async dispatch => {
  const stations = await getStationsFromAPI(
    stationId,
    StationSearchType.DBNavgiator
  );

  dispatch(action(stations[0]));
};

export default Actions;
