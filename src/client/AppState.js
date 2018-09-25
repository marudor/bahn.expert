// @flow
import type { State as AbfahrtenState } from 'client/reducer/abfahrten';
import type { State as AuslastungState } from 'client/reducer/auslastung';
import type { State as ConfigState } from 'client/reducer/config';
import type { State as FavState } from 'client/reducer/fav';
import type { State as ReihungState } from 'client/reducer/reihung';

export type AppState = {
  abfahrten: AbfahrtenState,
  auslastung: AuslastungState,
  config: ConfigState,
  fav: FavState,
  reihung: ReihungState,
};
