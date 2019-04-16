import abfahrten, { State as AbfahrtenState } from './abfahrten';
import auslastung, { State as AuslastungState } from './auslastung';
import config, { State as ConfigState } from './config';
import fav, { State as FavState } from './fav';
import reihung, { State as ReihungState } from './reihung';

export type AbfahrtenRootState = {
  abfahrten: AbfahrtenState;
  auslastung: AuslastungState;
  config: ConfigState;
  fav: FavState;
  reihung: ReihungState;
};

export default {
  abfahrten,
  auslastung,
  config,
  fav,
  reihung,
};
