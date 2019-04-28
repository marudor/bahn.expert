import abfahrten, { State as AbfahrtenState } from './abfahrten';
import auslastung, { State as AuslastungState } from './auslastung';
import config, { State as ConfigState } from './config';
import fav, { State as FavState } from './fav';

export type AbfahrtenRootState = {
  abfahrten: AbfahrtenState;
  config: ConfigState;
  fav: FavState;
  auslastung: AuslastungState;
};

export default {
  abfahrten,
  config,
  fav,
  auslastung,
};
