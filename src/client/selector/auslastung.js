// @flow
import { createSelector } from 'reselect';
import type { Abfahrt, Station } from 'types/abfahrten';
import type { AppState } from 'AppState';
import type { AuslastungEntry } from 'types/auslastung';

export type AuslastungProps = { +abfahrt: Abfahrt };
export const getAuslastung = (state: AppState) => state.auslastung.auslastung;
export const getTrainIdFromProps = (_: AppState, props: AuslastungProps) => props.abfahrt.trainId;
export const getCurrentStationFromProps = (_: AppState, props: AuslastungProps) => props.abfahrt.currentStation;
export const getStation = (state: AppState): ?Station => state.abfahrten.currentStation;

export const getAuslastungForId = createSelector<AppState, AuslastungProps, ?(AuslastungEntry[]), Object, string>(
  getAuslastung,
  getTrainIdFromProps,
  (auslastung: $PropertyType<$PropertyType<AppState, 'auslastung'>, 'auslastung'>, trainId) =>
    auslastung[trainId] ? auslastung[trainId].data : auslastung[trainId]
);

export const getAuslastungForIdCopy = createSelector<
  AppState,
  AuslastungProps,
  ?(AuslastungEntry[]),
  ?(AuslastungEntry[])
>(
  getAuslastungForId,
  auslastung => (auslastung ? [...auslastung] : auslastung)
);

export const getAuslastungForIdAndStation = createSelector<
  AppState,
  AuslastungProps,
  any,
  ?(AuslastungEntry[]),
  ?Station
>(
  getAuslastungForIdCopy,
  getStation,
  (auslastung, station) => {
    if (!station || auslastung === undefined) {
      return undefined;
    }
    if (auslastung === null) {
      return null;
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
