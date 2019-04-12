// @flow
import { type ActionType, handleActions } from 'redux-actions';
import { format } from 'date-fns';
import Actions from 'Routing/actions/search';
import type { Station } from 'types/station';

export type State = {
  start?: Station,
  destination?: Station,
  date: string,
  time: string,
};

const defaultState: State = {
  date: format(new Date(), 'yyyy-MM-dd'),
  time: format(new Date(), 'HH:mm'),
};

export default handleActions<State, *>(
  {
    [String(Actions.setDate)]: (state: State, { payload }: ActionType<typeof Actions.setDate>) => ({
      ...state,
      date: payload,
    }),
    [String(Actions.setTime)]: (state: State, { payload }: ActionType<typeof Actions.setTime>) => ({
      ...state,
      time: payload,
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
