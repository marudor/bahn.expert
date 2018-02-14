// @flow
import { createAction } from 'redux-actions';
import type { Station } from 'types/abfahrten';

export const fav = createAction('FAV', (station: Station) => station);

export const unfav = createAction('UNFAV', (station: Station) => station);
