// @flow
import { createAction } from 'redux-actions';
import { setCookieOptions } from 'client/util';
import axios from 'axios';
import type { Abfahrt, Station } from 'types/abfahrten';
import type { ThunkAction } from 'AppState';

export const Actions = {
  gotAbfahrten: createAction<
    string,
    {
      station: ?Station,
      abfahrten: Abfahrt[],
    }
  >('GOT_ABFAHRTEN'),
  gotAbfahrtenError: createAction<string, Error>('GOT_ABFAHRTEN_ERROR'),
  setDetail: createAction<string, ?string>('SET_DETAIL'),
  setCurrentStation: createAction<string, ?Station>('SET_CURRENT_STATION'),
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

export const getAbfahrtenByString: ThunkAction<?string> = stationString => async (dispatch, getState) => {
  try {
    const config = getState().config.config;
    const stations = await getStationsFromAPI(stationString, config.searchType);

    if (stations.length) {
      const url = `/api/ownAbfahrten/${stations[0].id}`;
      const abfahrten: Abfahrt[] = (await axios.get(url, {
        station: stations[0],
        params: {
          lookahead: config.lookahead,
        },
      })).data;

      return dispatch(Actions.gotAbfahrten({ station: stations[0], abfahrten }));
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
