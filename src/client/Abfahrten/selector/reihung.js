// @flow
import {
  type AuslastungProps,
  getCurrentStationFromProps,
  getTrainIdFromProps,
} from './auslastung';
import { createSelector } from 'reselect';
import type { AbfahrtenState } from 'AppState';
import type { Reihung } from 'types/reihung';

export const getReihung = (state: AbfahrtenState) => state.reihung.reihung;

export const getReihungForId = createSelector<
  AbfahrtenState,
  AuslastungProps,
  ?Reihung,
  $PropertyType<$PropertyType<AbfahrtenState, 'reihung'>, 'reihung'>,
  string,
  string
>(
  getReihung,
  getTrainIdFromProps,
  getCurrentStationFromProps,
  (reihung, trainId, currentStation) => reihung[trainId + currentStation]
);
