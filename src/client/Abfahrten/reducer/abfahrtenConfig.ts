import { createReducer } from 'deox';
import { defaultConfig } from 'client/util';
import { MarudorConfig } from 'Common/config';
import Actions from 'Abfahrten/actions/abfahrtenConfig';

export type State = {
  open: boolean;
  config: MarudorConfig;
};

const defaultState: State = {
  open: false,
  config: defaultConfig,
};

export default createReducer(defaultState, handle => [
  handle(Actions.setMenu, (state, { payload }) => ({
    ...state,
    open: payload,
  })),
  handle(Actions.setConfig, (state, { payload }) => ({
    ...state,
    config: payload,
  })),
]);
