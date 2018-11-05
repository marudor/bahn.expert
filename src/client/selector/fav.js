// @flow
import { createSelector } from 'reselect';
import type { AppState } from 'AppState';
import type { Station } from 'types/abfahrten';

export const favValues = createSelector<
  AppState,
  any,
  Station[],
  $PropertyType<$PropertyType<AppState, 'fav'>, 'favs'>
>(
  (state: AppState) => state.fav.favs,
  favs => {
    // $FlowFixMe this works
    const values: Station[] = Object.values(favs);

    return values;
  }
);

export const sortedFavValues = createSelector<AppState, any, Station[], Station[]>(favValues, favs =>
  favs.sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1))
);
