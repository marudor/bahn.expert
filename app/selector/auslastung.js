// @flow
import { createSelector } from 'reselect';
import { maxBy } from 'lodash';
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

export const getAuslastungForIdAndStation = createSelector(
  [getAuslastungForId, getStation],
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
      first: maxBy(auslastung, e => e.first).first,
      second: maxBy(auslastung, e => e.second).second,
    };
  }
);
