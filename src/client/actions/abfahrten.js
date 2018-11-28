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

async function getStationFromAPI(stationString: ?string, type: string): Promise<Station> {
  const stations = await getStationsFromAPI(stationString, type);

  if (stations.length) {
    return stations[0];
  }

  return { title: '', id: '0' };
}

async function abfahrtenByStation(station: Station) {
  const abfahrten: Abfahrt[] = (await axios.get(`/api/abfahrten/${station.id}`)).data;

  return abfahrten;
}

export const getAbfahrtenByStation: ThunkAction<Station> = station => async dispatch => {
  try {
    const abfahrten = await abfahrtenByStation(station);

    dispatch(
      Actions.gotAbfahrten({
        station,
        abfahrten,
      })
    );
  } catch (e) {
    dispatch(Actions.gotAbfahrtenError(e));
  }
};

export const getAbfahrtenByString: ThunkAction<?string, string> = (stationString, type) => async dispatch => {
  try {
    const station = await getStationFromAPI(stationString, type);

    if (station.id !== '0') {
      return dispatch(getAbfahrtenByStation(station));
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
