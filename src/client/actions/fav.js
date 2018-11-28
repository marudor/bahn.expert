// @flow
import { createAction } from 'redux-actions';
import type { Station } from 'types/abfahrten';

// eslint-disable-next-line import/prefer-default-export
export const Actions = {
  fav: createAction<string, Station>('FAV'),
  unfav: createAction<string, Station>('UNFAV'),
};
