import { AbfahrtenState } from 'AppState';
import { createSelector } from 'reselect';
import { getCurrentStationFromProps, getTrainIdFromProps } from './auslastung';

export const getReihung = (state: AbfahrtenState) => state.reihung.reihung;

export const getReihungForId = createSelector(
  getReihung,
  getTrainIdFromProps,
  getCurrentStationFromProps,
  (reihung, trainId, currentStation) => reihung[trainId + currentStation]
);
