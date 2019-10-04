import { Abfahrt, AbfahrtenResponse, Wings } from 'types/api/iris';
import { AbfahrtenThunkResult } from 'AppState';
import { AllowedStationAPIs } from 'types/api/station';
import { createAction } from 'deox';
import { getStationsFromAPI } from 'Common/service/stationSearch';
import { Station } from 'types/station';
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

type Departures = {
  lookahead: Abfahrt[];
  lookbehind: Abfahrt[];
};

const Actions = {
  gotAbfahrten: createAction(
    'GOT_ABFAHRTEN',
    resolve => (p: {
      station?: Station;
      departures: Departures;
      wings: Wings;
      lageplan?: null | string;
    }) => resolve(p)
  ),
  gotAbfahrtenError: createAction(
    'GOT_ABFAHRTEN_ERROR',
    resolve => (e: AbfahrtenError) => resolve(e)
  ),
  setCurrentStation: createAction(
    'SET_CURRENT_STATION',
    resolve => (s?: Station) => resolve(s)
  ),
  gotLageplan: createAction('GOT_LAGEPLAN', resolve => (s?: string) =>
    resolve(s)
  ),
  setFilterMenu: createAction('SET_FILTER_MENU', resolve => (open: boolean) =>
    resolve(open)
  ),
};

export default Actions;

let cancelGetAbfahrten = () => {};

async function getAbfahrtenFromAPI(
  station: Station,
  lookahead: string,
  lookbehind: string
): Promise<AbfahrtenResponse> {
  cancelGetAbfahrten();

  const r = await axios.get<AbfahrtenResponse>(
    `/api/iris/current/abfahrten/${station.id}`,
    {
      cancelToken: new axios.CancelToken(c => {
        cancelGetAbfahrten = c;
      }),
      // @ts-ignore
      station,
      params: {
        lookahead,
        lookbehind,
      },
    }
  );

  return r.data;
}

export const getLageplan = (
  stationName: string
): AbfahrtenThunkResult => async dispatch => {
  const lageplan = (await axios.get(
    `/api/bahnhof/current/lageplan/${stationName}`
  )).data.lageplan;

  dispatch(Actions.gotLageplan(lageplan));

  return lageplan;
};

export const getAbfahrtenByString = (
  stationString?: string,
  searchType?: AllowedStationAPIs
): AbfahrtenThunkResult => async (dispatch, getState) => {
  try {
    const config = getState().abfahrtenConfig.config;
    const stations = await getStationsFromAPI(
      stationString,
      searchType || config.searchType
    );

    if (stations.length) {
      const { departures, lookbehind, ...rest } = await getAbfahrtenFromAPI(
        stations[0],
        config.lookahead,
        config.lookbehind
      );

      dispatch(
        Actions.gotAbfahrten({
          station: stations[0],
          departures: {
            lookahead: departures,
            lookbehind,
          },
          ...rest,
        })
      );

      return;
    }
    throw {
      type: '404',
    };
  } catch (e) {
    if (!axios.isCancel(e)) {
      e.station = decodeURIComponent(stationString || '');
      dispatch(Actions.gotAbfahrtenError(e));
    }
  }
};

export const refreshCurrentAbfahrten = (): AbfahrtenThunkResult => async (
  dispatch,
  getState
) => {
  const state = getState();

  if (!state.abfahrten.currentStation) {
    return;
  }

  const { departures, lookbehind, ...rest } = await getAbfahrtenFromAPI(
    state.abfahrten.currentStation,
    state.abfahrtenConfig.config.lookahead,
    state.abfahrtenConfig.config.lookbehind
  );

  dispatch(
    Actions.gotAbfahrten({
      station: state.abfahrten.currentStation,
      departures: {
        lookahead: departures,
        lookbehind,
      },
      ...rest,
    })
  );
};

export const openFilter = () => Actions.setFilterMenu(true);
export const closeFilter = () => Actions.setFilterMenu(false);
