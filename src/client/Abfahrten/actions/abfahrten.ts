import { Abfahrt, AbfahrtAPIResult, Wings } from 'types/abfahrten';
import { AbfahrtenThunkResult } from 'AppState';
import { createAction } from 'deox';
import { getStationsFromAPI } from 'Common/service/stationSearch';
import { setCookieOptions } from 'client/util';
import { Station } from 'types/station';
import { StationSearchType } from 'Common/config';
import axios, { AxiosError } from 'axios';

export type AbfahrtenError =
  | AbfahrtenError$Redirect
  | AbfahrtenError$404
  | AbfahrtenError$Default;
type AbfahrtenError$Redirect = Error & {
  type: 'redirect';
  redirect: string;
  station?: void;
};

type AbfahrtenError$404 = Error & {
  type: '404';
  station?: void;
};
type AbfahrtenError$Default = AxiosError & {
  type: void;
  station?: string;
};

const Actions = {
  gotAbfahrten: createAction(
    'GOT_ABFAHRTEN',
    resolve => (p: {
      station?: Station;
      departures: Abfahrt[];
      wings: Wings;
      lageplan?: null | string;
    }) => resolve(p)
  ),
  gotAbfahrtenError: createAction(
    'GOT_ABFAHRTEN_ERROR',
    resolve => (e: AbfahrtenError) => resolve(e)
  ),
  setDetail: createAction('SET_DETAIL', resolve => (s?: string) => resolve(s)),
  setCurrentStation: createAction(
    'SET_CURRENT_STATION',
    resolve => (s?: Station) => resolve(s)
  ),
  gotLageplan: createAction('GOT_LAGEPLAN', resolve => (s?: string) =>
    resolve(s)
  ),
};

export default Actions;

let cancelGetAbfahrten = () => {};

async function getAbfahrtenFromAPI(
  station: Station,
  lookahead: string
): Promise<AbfahrtAPIResult> {
  cancelGetAbfahrten();

  const r = await axios.get<AbfahrtAPIResult>(
    `/api/ownAbfahrten/${station.id}`,
    {
      cancelToken: new axios.CancelToken(c => {
        cancelGetAbfahrten = c;
      }),
      // @ts-ignore
      station,
      params: {
        lookahead,
      },
    }
  );

  return r.data;
}

export const getLageplan = (
  stationName: string
): AbfahrtenThunkResult => async dispatch => {
  const lageplan = (await axios.get(`/api/lageplan/${stationName}`)).data
    .lageplan;

  dispatch(Actions.gotLageplan(lageplan));

  return lageplan;
};

export const getAbfahrtenByString = (
  stationString?: string,
  searchType?: StationSearchType
): AbfahrtenThunkResult => async (dispatch, getState) => {
  try {
    const config = getState().config.config;
    const stations = await getStationsFromAPI(
      stationString,
      searchType || config.searchType
    );

    if (stations.length) {
      const abfahrten = await getAbfahrtenFromAPI(
        stations[0],
        config.lookahead
      );

      dispatch(Actions.gotAbfahrten({ station: stations[0], ...abfahrten }));

      return;
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

export const setDetail = (selectedDetail?: string): AbfahrtenThunkResult => (
  dispatch,
  getState
) => {
  const state = getState();
  const cookies = state.config.cookies;
  const detail =
    state.abfahrten.selectedDetail === selectedDetail
      ? undefined
      : selectedDetail;

  if (detail) {
    cookies.set('selectedDetail', detail, setCookieOptions);
  } else {
    cookies.remove('selectedDetail');
  }
  dispatch(Actions.setDetail(detail));
};

export const refreshCurrentAbfahrten = (): AbfahrtenThunkResult => async (
  dispatch,
  getState
) => {
  try {
    const state = getState();

    if (!state.abfahrten.currentStation) {
      return;
    }
    const abfahrten = await getAbfahrtenFromAPI(
      state.abfahrten.currentStation,
      state.config.config.lookahead
    );

    dispatch(
      Actions.gotAbfahrten({
        station: state.abfahrten.currentStation,
        ...abfahrten,
      })
    );
  } catch (e) {
    // We ignore errors here - otherwise we might display error automatically due to refresh after back online
  }
};
