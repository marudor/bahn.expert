import { createReducer } from 'deox';

export type CommonRootState = {
  features: Features;
};

export default {
  features: createReducer({}, handle => []),
};
