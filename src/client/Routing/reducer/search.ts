import { createReducer } from 'deox';
import { Station } from 'types/station';
import Actions from 'Routing/actions/search';

export type State = {
  start?: Station;
  destination?: Station;
  date: Date;
  dateTouched?: true;
};

const defaultState: State = {
  date: new Date(),
};

export default createReducer(defaultState, handle => [
  handle(Actions.setDate, (state, { payload }) => ({
    ...state,
    date: payload,
    dateTouched: true,
  })),
  handle(Actions.setDestination, (state, { payload }) => ({
    ...state,
    destination: payload,
  })),
  handle(Actions.setStart, (state, { payload }) => ({
    ...state,
    start: payload,
  })),
]);
