// @flow
import { createSelector } from 'reselect';
import { maxBy } from 'lodash';
import type { AppState } from 'AppState';
import type { AuslastungEntry } from 'types/auslastung';
import type { Station } from 'types/abfahrten';

export const getAuslastung = (state: AppState) => state.auslastung.auslastung;
export const getTrainIdFromProps = (_: AppState, props: any) => props.abfahrt.trainId;
export const getStation = (state: AppState) => state.abfahrten.currentStation;

export const getAuslastungForId = createSelector(
  [getAuslastung, getTrainIdFromProps],
  (auslastung, trainId) => auslastung[trainId]?.data
);

export const getAuslastungForIdAndStation = createSelector(
  [getAuslastungForId, getStation],
  (auslastung: ?(AuslastungEntry[]), station: ?Station) => {
    if (!station || !auslastung) {
      return null;
    }
    while (auslastung.length && auslastung[0].start !== station.title) {
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
