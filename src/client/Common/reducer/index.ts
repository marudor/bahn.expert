import { createReducer } from 'deox';
import { Features } from 'server/features';
import reihung, { State as ReihungState } from './reihung';

export type CommonRootState = {
  features: Features;
  reihung: ReihungState;
};

export default {
  features: createReducer({}, handle => []),
  reihung,
};
