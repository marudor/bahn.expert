import { Abfahrt } from 'types/abfahrten';
import { CommonState } from 'AppState';
import { createSelector } from 'reselect';

export const getReihung = (state: CommonState) => state.reihung.reihung;

type AuslastungProps = {
  currentStation: string;
  trainNumber: string;
};
export const getCurrentStationFromProps = (_: any, props: AuslastungProps) =>
  props.currentStation;
export const getTrainIdFromProps = (_: any, props: AuslastungProps) =>
  props.trainNumber;

export const getReihungForId = createSelector(
  getReihung,
  getTrainIdFromProps,
  getCurrentStationFromProps,
  (reihung, trainNumber, currentStation) =>
    reihung[trainNumber + currentStation]
);
