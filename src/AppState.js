// @flow
import type { State as AbfahrtenState } from 'reducer/abfahrten';
import type { State as AuslastungState } from 'reducer/auslastung';
import type { State as FavState } from 'reducer/fav';

export type AppState = {
  abfahrten: AbfahrtenState,
  auslastung: AuslastungState,
  fav: FavState,
};
