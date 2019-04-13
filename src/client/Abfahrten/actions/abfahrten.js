// @flow
import { createAction } from 'redux-actions';
import { getStationsFromAPI } from 'Common/service/stationSearch';
import { setCookieOptions } from 'client/util';
import axios from 'axios';
import type { Abfahrt, AbfahrtAPIResult, Wings } from 'types/abfahrten';
import type { AbfahrtenThunkAction } from 'AppState';
import type { Station } from 'types/station';

const Actions = {
  gotAbfahrten: createAction<
    string,
    {|
      station: ?Station,
      departures: Abfahrt[],
      wings: Wings,
      lageplan?: ?string,
    |}
  >('GOT_ABFAHRTEN'),
  gotAbfahrtenError: createAction<string, Error>('GOT_ABFAHRTEN_ERROR'),
  setDetail: createAction<string, ?string>('SET_DETAIL'),
  setCurrentStation: createAction<string, ?Station>('SET_CURRENT_STATION'),
  gotLageplan: createAction<string, ?string>('GOT_LAGEPLAN'),
};

export default Actions;

let cancelGetAbfahrten = () => {};

function getAbfahrtenFromAPI(station: Station, lookahead: string): Promise<AbfahrtAPIResult> {
  cancelGetAbfahrten();

  return axios
    .get(`/api/ownAbfahrten/${station.id}`, {
      cancelToken: new axios.CancelToken(c => {
        cancelGetAbfahrten = c;
      }),
      station,
      params: {
        lookahead,
      },
    })
    .then(d => d.data);
}

export const getLageplan: AbfahrtenThunkAction<string> = stationName => async dispatch => {
  const lageplan = (await axios.get(`/api/lageplan/${stationName}`)).data.lageplan;

  dispatch(Actions.gotLageplan(lageplan));

  return lageplan;
};

export const getAbfahrtenByString: AbfahrtenThunkAction<?string, ?StationSearchType> = (
  stationString,
  searchType
) => async (dispatch, getState) => {
  try {
    const config = getState().config.config;
    const stations = await getStationsFromAPI(stationString, searchType || config.searchType);

    if (stations.length) {
      const abfahrten = await getAbfahrtenFromAPI(stations[0], config.lookahead);

      return dispatch(Actions.gotAbfahrten({ station: stations[0], ...abfahrten }));
    }
    throw {
      type: '404',
    };
  } catch (e) {
    if (!axios.isCancel(e)) {
      e.station = stationString;
      dispatch(Actions.gotAbfahrtenError(e));
    }
  }
};

export const setDetail: AbfahrtenThunkAction<?string> = selectedDetail => (dispatch, getState) => {
  const state = getState();
  const cookies = state.config.cookies;
  const detail: ?string = state.abfahrten.selectedDetail === selectedDetail ? null : selectedDetail;

  if (detail) {
    cookies.set('selectedDetail', detail, setCookieOptions);
  } else {
    cookies.remove('selectedDetail');
  }
  dispatch(Actions.setDetail(detail));

  return Promise.resolve();
};

export const refreshCurrentAbfahrten: AbfahrtenThunkAction<> = () => async (dispatch, getState) => {
  try {
    const state = getState();

    if (!state.abfahrten.currentStation) {
      return;
    }
    const abfahrten = await getAbfahrtenFromAPI(state.abfahrten.currentStation, state.config.config.lookahead);

    return dispatch(
      Actions.gotAbfahrten({
        station: state.abfahrten.currentStation,
        ...abfahrten,
      })
    );
  } catch (e) {
    // We ignore errors here - otherwise we might display error automatically due to refresh after back online
  }
};
