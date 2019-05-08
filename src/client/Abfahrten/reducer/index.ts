import abfahrten, { State as AbfahrtenState } from './abfahrten';
import abfahrtenConfig, {
  State as AbfahrtenConfigState,
} from './abfahrtenConfig';
import auslastung, { State as AuslastungState } from './auslastung';
import fav, { State as FavState } from './fav';

export type AbfahrtenRootState = {
  abfahrten: AbfahrtenState;
  abfahrtenConfig: AbfahrtenConfigState;
  fav: FavState;
  auslastung: AuslastungState;
};

export default {
  abfahrten,
  abfahrtenConfig,
  fav,
  auslastung,
};
