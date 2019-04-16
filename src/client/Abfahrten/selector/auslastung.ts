import { Abfahrt } from 'types/abfahrten';
import { AbfahrtenState } from 'AppState';
import { AuslastungsValue } from 'types/auslastung';
import { createSelector } from 'reselect';
import { Station } from 'types/station';

type AuslastungProps = {
  abfahrt: Abfahrt;
};
export const getAuslastung = (state: AbfahrtenState) =>
  state.auslastung.auslastung;
export const getTrainIdFromProps = (_: any, props: AuslastungProps) =>
  props.abfahrt.trainId;
export const getCurrentStationFromProps = (_: any, props: AuslastungProps) =>
  props.abfahrt.currentStation;
export const getStation = (state: AbfahrtenState): undefined | Station =>
  state.abfahrten.currentStation;

export const getAuslastungForId = createSelector(
  getAuslastung,
  getTrainIdFromProps,
  (auslastung, trainId) => {
    const specificAuslastung = auslastung[trainId];

    if (specificAuslastung) {
      return specificAuslastung.data;
    }

    return specificAuslastung;
  }
);

export const getAuslastungForIdCopy = createSelector(
  getAuslastungForId,
  auslastung => (auslastung ? [...auslastung] : auslastung)
);

export const getAuslastungForIdAndStation = createSelector(
  getAuslastungForIdCopy,
  getStation,
  (auslastung, station) => {
    if (!station || auslastung === undefined) {
      return undefined;
    }
    if (auslastung === null) {
      return null;
    }
    while (
      auslastung.length &&
      auslastung[0].start.replace(/ /g, '') !== station.title.replace(/ /g, '')
    ) {
      auslastung.shift();
    }
    if (!auslastung.length) {
      return null;
    }

    const first = auslastung.reduce(
      (p, c) => (p > c.first ? p : c.first),
      AuslastungsValue.Green
    );
    const second = auslastung.reduce(
      (p, c) => (p > c.second ? p : c.second),
      AuslastungsValue.Green
    );

    return {
      first,
      second,
    };
  }
);
