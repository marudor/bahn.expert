// @flow
import { createSelector } from 'reselect';
import { getTrainIdFromProps } from './auslastung';
import type { AppState } from 'AppState';

export const getReihung = (state: AppState) => state.reihung.reihung;

export const getReihungForId = createSelector(
  [getReihung, getTrainIdFromProps],
  (reihung, trainId) => reihung[String(trainId)]
);
