// @flow
import { createSelector } from 'reselect';
import type { AbfahrtenState } from 'AppState';
import type { Station } from 'types/station';

export const favValues = createSelector<
  AbfahrtenState,
  any,
  Station[],
  $PropertyType<$PropertyType<AbfahrtenState, 'fav'>, 'favs'>
>(
  state => state.fav.favs,
  favs => {
    // $FlowFixMe this works
    const values: Station[] = Object.values(favs);

    return values;
  }
);

export const sortedFavValues = createSelector<AbfahrtenState, any, Station[], Station[]>(
  favValues,
  favs => favs.sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1))
);
