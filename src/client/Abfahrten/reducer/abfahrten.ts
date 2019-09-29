import { Abfahrt, Wings } from 'types/abfahrten';
import { createReducer } from 'deox';
import { Station } from 'types/station';
import Actions, { AbfahrtenError } from 'Abfahrten/actions/abfahrten';

export type State = {
  departures?: {
    lookahead: Abfahrt[];
    lookbehind: Abfahrt[];
  };
  wings?: Wings;
  currentStation?: Station;
  error?: AbfahrtenError;
  lageplan?: null | string;
  filterMenu: boolean;
};

const defaultState: State = {
  lageplan: undefined,
  filterMenu: false,
};

export default createReducer(defaultState, handle => [
  handle(Actions.gotLageplan, (state, { payload }) => ({
    ...state,
    lageplan: payload,
  })),
  handle(Actions.gotAbfahrten, (state, { payload }) => ({
    ...state,
    currentStation: payload.station,
    departures: payload.departures,
    wings: payload.wings,
    lageplan: payload.lageplan,
    error: undefined,
  })),
  handle(Actions.gotAbfahrtenError, (state, { payload }) => ({
    ...state,
    departures: undefined,
    wings: {},
    lageplan: undefined,
    error: payload,
  })),
  handle(Actions.setCurrentStation, (state, { payload }) => ({
    ...state,
    currentStation: payload,
    departures: undefined,
    wings: undefined,
    lageplan: undefined,
  })),
  handle(Actions.setFilterMenu, (state, { payload }) => ({
    ...state,
    filterMenu: payload,
  })),
]);
