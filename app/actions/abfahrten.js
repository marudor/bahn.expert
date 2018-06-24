// @flow
import { createAction } from 'redux-actions';
import axios from 'axios';
import type { Abfahrt, Station } from 'types/abfahrten';

async function getStationFromAPI(stationString: ?string) {
  if (stationString) {
    const possibleStations = (await axios.get(`/api/search/off/${stationString}`)).data;

    if (possibleStations.length) {
      return possibleStations[0];
    }
  }

  return Promise.resolve({ title: '', id: '0' });
}

export const getStation = createAction('GET_STATION', getStationFromAPI);

async function abfahrtenByStation(station: Station) {
  const abfahrten: Abfahrt[] = (await axios.get(`/api/abfahrten/${station.id}`)).data;

  return abfahrten;
}

export const getAbfahrtenByStation = createAction('ABFAHRTEN_BY_STATION', async (station: Station) => ({
  station,
  abfahrten: await abfahrtenByStation(station),
}));

export const getAbfahrtenByString = createAction('ABFAHRTEN_BY_STRING', async (stationString: ?string) => {
  const station = await getStationFromAPI(stationString);

  if (station.id !== '0') {
    return {
      station,
      abfahrten: await abfahrtenByStation(station),
    };
  }

  return {
    station: null,
    abfahrten: [],
  };
});

export const setDetail = createAction('SET_DETAIL');

export const setCurrentStation = createAction('SET_CURRENT_STATION');
