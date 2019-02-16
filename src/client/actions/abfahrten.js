// @flow
import { createAction } from 'redux-actions';
import { setCookieOptions } from 'client/util';
import axios from 'axios';
import type { Abfahrt, AbfahrtAPIResult, Station, Wings } from 'types/abfahrten';
import type { InnerThunkAction, ThunkAction } from 'AppState';

export const Actions = {
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

export async function getStationsFromAPI(stationString: ?string, type: string = ''): Promise<Station[]> {
  if (stationString) {
    return (await axios.get(`/api/search/${stationString}`, {
      params: {
        type,
      },
    })).data;
  }

  return Promise.resolve([]);
}

const pendingMap = new Map<string | number, Promise<AbfahrtAPIResult>>();

function getAbfahrtenFromAPI(station: Station, lookahead: string): Promise<AbfahrtAPIResult> {
  const pending = pendingMap.get(station.id);

  if (pending) {
    return pending;
  }
  const abfahrtPromise = axios
    .get(`/api/ownAbfahrten/${station.id}`, {
      station,
      params: {
        lookahead,
      },
    })
    .then(d => d.data);

  pendingMap.set(station.id, abfahrtPromise);
  abfahrtPromise.finally(() => pendingMap.delete(station.id));

  return abfahrtPromise;
}

export const getLageplan: ThunkAction<string> = stationName => async dispatch => {
  const lageplan = (await axios.get(`/api/lageplan/${stationName}`)).data.lageplan;

  dispatch(Actions.gotLageplan(lageplan));

  return lageplan;
};

export const getAbfahrtenByString: ThunkAction<?string> = stationString => async (dispatch, getState) => {
  try {
    const config = getState().config.config;
    const stations = await getStationsFromAPI(stationString, config.searchType);

    if (stations.length) {
      const abfahrten = await getAbfahrtenFromAPI(stations[0], config.lookahead);

      return dispatch(Actions.gotAbfahrten({ station: stations[0], ...abfahrten }));
    }
    throw {
      type: '404',
    };
  } catch (e) {
    e.station = stationString;
    dispatch(Actions.gotAbfahrtenError(e));
  }
};

export const setDetail: ThunkAction<?string> = selectedDetail => (dispatch, getState) => {
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

export const refreshCurrentAbfahrten: InnerThunkAction = async (dispatch, getState) => {
  try {
    const state = getState();

    if (!state.abfahrten.currentStation) {
      return;
    }
    const abfahrten = await getAbfahrtenFromAPI(state.abfahrten.currentStation, state.config.config.lookahead);

    return dispatch(Actions.gotAbfahrten({ station: state.abfahrten.currentStation, ...abfahrten }));
  } catch (e) {
    // We ignore errors here - otherwise we might display error automatically due to refresh after back online
  }
};
