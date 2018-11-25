// @flow
import { type AuslastungProps, getTrainIdFromProps } from './auslastung';
import { createSelector } from 'reselect';
import type { AppState } from 'AppState';
import type { Reihung } from 'types/reihung';

export const getReihung = (state: AppState) => state.reihung.reihung;

export const getReihungForId = createSelector<
  AppState,
  AuslastungProps,
  ?Reihung,
  $PropertyType<$PropertyType<AppState, 'reihung'>, 'reihung'>,
  string
>(
  getReihung,
  getTrainIdFromProps,
  (reihung, trainId) => reihung[String(trainId)]
);
