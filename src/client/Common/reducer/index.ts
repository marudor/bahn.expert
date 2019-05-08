import { createReducer } from 'deox';
import { Features } from 'server/features';
import config, { State as ConfigState } from './config';
import reihung, { State as ReihungState } from './reihung';

export type CommonRootState = {
  features: Features;
  reihung: ReihungState;
  config: ConfigState;
};

export default {
  features: createReducer({}, handle => []),
  reihung,
  config,
};
