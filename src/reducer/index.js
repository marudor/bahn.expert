// @ƒlow
import { combineReducers } from 'redux';
import abfahrten from './abfahrten';
import auslastung from './auslastung';
import fav from './fav';

export default combineReducers({
  abfahrten,
  auslastung,
  fav,
});
