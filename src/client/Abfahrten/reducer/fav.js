// @flow
import { type ActionType, handleActions } from 'redux-actions';
import Actions from 'Abfahrten/actions/fav';
import type { Station } from 'types/station';

export type State = {
  favs: { [key: string | number]: Station },
};

const defaultState = {
  favs: {},
};

export default handleActions<State, *>(
  {
    [String(Actions.setFavs)]: (
      state: State,
      { payload }: ActionType<typeof Actions.setFavs>
    ) => ({
      ...state,
      favs: payload,
    }),
  },
  defaultState
);
