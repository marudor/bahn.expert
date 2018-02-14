// @flow
import type { State as AbfahrtenState } from 'reducer/abfahrten';
import type { State as FavState } from 'reducer/fav';

export type AppState = {
  fav: FavState,
  abfahrten: AbfahrtenState,
};
