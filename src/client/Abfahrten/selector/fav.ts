import { AbfahrtenState } from 'AppState';
import { createSelector } from 'reselect';

export const favValues = createSelector(
  (state: AbfahrtenState) => state.fav.favs,
  favs => Object.values(favs)
);

export const sortedFavValues = createSelector(
  favValues,
  favs =>
    favs.sort((a, b) =>
      a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1
    )
);
