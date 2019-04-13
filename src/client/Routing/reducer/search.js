// @flow
import { type ActionType, handleActions } from 'redux-actions';
import Actions from 'Routing/actions/search';
import type { Station } from 'types/station';

export type State = {
  start?: Station,
  destination?: Station,
  date: Date,
  dateTouched?: true,
};

const defaultState: State = {
  date: new Date(),
};

export default handleActions<State, *>(
  {
    [String(Actions.setDate)]: (state: State, { payload }: ActionType<typeof Actions.setDate>) => ({
      ...state,
      date: payload,
      dateTouched: true,
    }),
    [String(Actions.setDestination)]: (state: State, { payload }: ActionType<typeof Actions.setDestination>) => ({
      ...state,
      destination: payload,
    }),
    [String(Actions.setStart)]: (state: State, { payload }: ActionType<typeof Actions.setStart>) => ({
      ...state,
      start: payload,
    }),
  },
  defaultState
);
