import { Abfahrt } from 'types/abfahrten';
import { AbfahrtenState } from 'AppState';
import { createSelector } from 'reselect';

export const getReihung = (state: AbfahrtenState) => state.reihung.reihung;

type AuslastungProps = {
  abfahrt: Abfahrt;
};
export const getCurrentStationFromProps = (_: any, props: AuslastungProps) =>
  props.abfahrt.currentStation;
export const getTrainIdFromProps = (_: any, props: AuslastungProps) =>
  props.abfahrt.trainId;

export const getReihungForId = createSelector(
  getReihung,
  getTrainIdFromProps,
  getCurrentStationFromProps,
  (reihung, trainId, currentStation) => reihung[trainId + currentStation]
);
