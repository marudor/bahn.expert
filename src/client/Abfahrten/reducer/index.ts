import abfahrten, { State as AbfahrtenState } from './abfahrten';
import abfahrtenConfig, {
  State as AbfahrtenConfigState,
} from './abfahrtenConfig';

export type AbfahrtenRootState = {
  abfahrten: AbfahrtenState;
  abfahrtenConfig: AbfahrtenConfigState;
};

export default {
  abfahrten,
  abfahrtenConfig,
};
