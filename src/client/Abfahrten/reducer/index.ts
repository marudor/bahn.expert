import abfahrten, { State as AbfahrtenState } from './abfahrten';

export type AbfahrtenRootState = {
  abfahrten: AbfahrtenState;
};

export default {
  abfahrten,
};
