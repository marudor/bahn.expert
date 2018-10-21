// @flow
import { createSelector } from 'reselect';
import type { Abfahrt, Station } from 'types/abfahrten';
import type { AppState } from 'AppState';
import type { AuslastungEntry } from 'types/auslastung';

export const getAuslastung = (state: AppState) => state.auslastung.auslastung;
export const getTrainIdFromProps = (_: AppState, props: { abfahrt: Abfahrt }) => props.abfahrt.trainId;
export const getStation = (state: AppState) => state.abfahrten.currentStation;

export const getAuslastungForId = createSelector(
  [getAuslastung, getTrainIdFromProps],
  (auslastung, trainId) => auslastung[trainId]?.data
);

export const getAuslastungForIdCopy = createSelector(
  getAuslastungForId,
  auslastung => (auslastung ? [...auslastung] : auslastung)
);

export const getAuslastungForIdAndStation = createSelector(
  [getAuslastungForIdCopy, getStation],
  (auslastung: ?(AuslastungEntry[]), station: ?Station) => {
    if (!station || !auslastung) {
      return undefined;
    }
    while (auslastung.length && auslastung[0].start.replace(/ /g, '') !== station.title.replace(/ /g, '')) {
      auslastung.shift();
    }
    if (!auslastung.length) {
      return null;
    }

    return {
      first: auslastung.reduce((p, c) => (p > c.first ? p : c.first), 0),
      second: auslastung.reduce((p, c) => (p > c.second ? p : c.second), 0),
    };
  }
);
