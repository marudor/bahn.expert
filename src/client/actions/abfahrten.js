// @flow
import { createAction } from 'redux-actions';
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
    return (await axios.get(`/api/search/${stationString}?type=${type}`)).data;
  }

  return [];
}

export const getAbfahrtenByString: ThunkAction<?string, string> = (stationString, type) => async (
  dispatch,
  getState
) => {
  try {
    const stations = await getStationsFromAPI(stationString, type);

    if (stations.length) {
      const url = getState().config.useDbf
        ? `/api/dbfAbfahrten/${stations[0].id}`
        : `/api/ownAbfahrten/${stations[0].id}`;
      const abfahrten: Abfahrt[] = (await axios.get(url)).data;

      return dispatch(Actions.gotAbfahrten({ station: stations[0], abfahrten }));
    }
    dispatch(
      Actions.gotAbfahrten({
        station: null,
        abfahrten: [],
      })
    );
  } catch (e) {
    dispatch(Actions.gotAbfahrtenError(e));
  }
};
