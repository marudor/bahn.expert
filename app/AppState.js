// @flow
import type { State as AbfahrtenState } from 'reducer/abfahrten';
import type { State as AuslastungState } from 'reducer/auslastung';
import type { State as ConfigState } from 'reducer/config';
import type { State as FavState } from 'reducer/fav';
import type { State as ReihungState } from 'reducer/reihung';

export type AppState = {
  abfahrten: AbfahrtenState,
  auslastung: AuslastungState,
  config: ConfigState,
  fav: FavState,
  reihung: ReihungState,
};
