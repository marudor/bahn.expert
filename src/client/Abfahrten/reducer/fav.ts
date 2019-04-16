import { createReducer } from 'deox';
import { Station } from 'types/station';
import Actions from 'Abfahrten/actions/fav';

export type State = {
  favs: { [key: string]: Station };
};

const defaultState: State = {
  favs: {},
};

export default createReducer(defaultState, handle => [
  handle(Actions.setFavs, (state, { payload }) => ({
    ...state,
    favs: payload,
  })),
]);
