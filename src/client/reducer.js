// @flow
import { combineReducers } from 'redux';
import abfahrtenReducer from 'Abfahrten/reducer';
import routingReducer from 'Routing/reducer';

export default combineReducers<any, any>({
  ...abfahrtenReducer,
  ...routingReducer,
});
