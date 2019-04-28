import { createReducer } from 'deox';
import { Features } from 'server/features';

export type CommonRootState = {
  features: Features;
};

export default {
  features: createReducer({}, handle => []),
};
