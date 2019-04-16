import { AppState } from 'AppState';
import { combineReducers } from 'redux';
import abfahrtenReducer from 'Abfahrten/reducer';
import commonReducer from 'Common/reducer';
import routingReducer from 'Routing/reducer';

export default combineReducers<AppState, any>({
  ...abfahrtenReducer,
  ...routingReducer,
  ...commonReducer,
} as any);
