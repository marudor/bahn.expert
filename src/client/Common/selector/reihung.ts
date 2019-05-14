import { CommonState } from 'AppState';
import { createSelector } from 'reselect';

export const getReihung = (state: CommonState) => state.reihung.reihung;

type AuslastungProps = {
  currentStation: string;
  trainNumber: string;
};
export const getCurrentStationFromProps = (_: any, props: AuslastungProps) =>
  props.currentStation;
export const getTrainNumberFromProps = (_: any, props: AuslastungProps) =>
  props.trainNumber;

export const getReihungForId = createSelector(
  getReihung,
  getTrainNumberFromProps,
  getCurrentStationFromProps,
  (reihung, trainNumber, currentStation) =>
    reihung[trainNumber + currentStation]
);
