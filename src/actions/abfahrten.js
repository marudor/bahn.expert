// @flow
import { createAction } from 'redux-actions';
import { List } from 'immutable';
import axios from 'axios';
import uuid from 'uuid';
import type { Abfahrt, Station } from 'types/abfahrten';

async function getStationFromAPI(stationString: ?string) {
  if (stationString) {
    const possibleStations = (await axios.get(`/api/search/${stationString}`)).data;

    if (possibleStations.length) {
      return possibleStations[0];
    }
  }

  return Promise.resolve({ title: '', id: '0' });
}

export const getStation = createAction('GET_STATION', getStationFromAPI);

async function abfahrtenByStation(station: Station) {
  const abfahrten: {
    error?: any,
    departures: Abfahrt[],
  } = (await axios.get(`/api/abfahrten/${station.id}`)).data;

  if (abfahrten.error) {
    throw new Error(abfahrten.error);
  }
  abfahrten.departures.forEach(a => (a.id = uuid.v4()));

  return List(abfahrten.departures);
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
    abfahrten: List(),
  };
});

export const setDetail = createAction('SET_DETAIL');

export const setCurrentStation = createAction('SET_CURRENT_STATION', station => station);
