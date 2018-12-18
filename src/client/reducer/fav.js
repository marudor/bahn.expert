// @flow
import { Actions } from 'client/actions/fav';
import { type ActionType, handleActions } from 'redux-actions';
import type { Station } from 'types/abfahrten';

export type State = {
  favs: { [key: string | number]: Station },
};

const defaultState = {
  favs: {},
};

export default handleActions<State, *>(
  {
    [String(Actions.setFavs)]: (state: State, { payload }: ActionType<typeof Actions.setFavs>) => ({
      ...state,
      favs: payload,
    }),
  },
  defaultState
);
