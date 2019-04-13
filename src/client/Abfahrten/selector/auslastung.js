// @flow
import { createSelector } from 'reselect';
import type { Abfahrt } from 'types/abfahrten';
import type { AbfahrtenState } from 'AppState';
import type { AuslastungEntry } from 'types/auslastung';
import type { Station } from 'types/station';

export type AuslastungProps = { +abfahrt: Abfahrt };
export const getAuslastung = (state: AbfahrtenState) =>
  state.auslastung.auslastung;
export const getTrainIdFromProps = (
  _: AbfahrtenState,
  props: AuslastungProps
) => props.abfahrt.trainId;
export const getCurrentStationFromProps = (
  _: AbfahrtenState,
  props: AuslastungProps
) => props.abfahrt.currentStation;
export const getStation = (state: AbfahrtenState): ?Station =>
  state.abfahrten.currentStation;

export const getAuslastungForId = createSelector<
  AbfahrtenState,
  AuslastungProps,
  ?(AuslastungEntry[]),
  *,
  string
>(
  getAuslastung,
  getTrainIdFromProps,
  (
    auslastung: $PropertyType<
      $PropertyType<AbfahrtenState, 'auslastung'>,
      'auslastung'
    >,
    trainId
  ) => (auslastung[trainId] ? auslastung[trainId].data : auslastung[trainId])
);

export const getAuslastungForIdCopy = createSelector<
  AbfahrtenState,
  AuslastungProps,
  ?(AuslastungEntry[]),
  ?(AuslastungEntry[])
>(
  getAuslastungForId,
  auslastung => (auslastung ? [...auslastung] : auslastung)
);

export const getAuslastungForIdAndStation = createSelector<
  AbfahrtenState,
  AuslastungProps,
  *,
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
    while (
      auslastung.length &&
      auslastung[0].start.replace(/ /g, '') !== station.title.replace(/ /g, '')
    ) {
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
