// @flow
import abfahrten, { type State as AbfahrtenState } from './abfahrten';
import auslastung, { type State as AuslastungState } from './auslastung';
import config, { type State as ConfigState } from './config';
import fav, { type State as FavState } from './fav';
import reihung, { type State as ReihungState } from './reihung';

export type AbfahrtenRootState = {|
  +abfahrten: AbfahrtenState,
  +auslastung: AuslastungState,
  +config: ConfigState,
  +fav: FavState,
  +reihung: ReihungState,
|};

export default {
  abfahrten,
  auslastung,
  config,
  fav,
  reihung,
};
