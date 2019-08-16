import { AbfahrtenRootState } from 'Abfahrten/reducer';
import { RoutingRootState } from 'Routing/reducer';
import { Store } from 'redux';
import { ThunkAction } from 'redux-thunk';

export type RoutingState = RoutingRootState;
export type AbfahrtenState = AbfahrtenRootState;
export type AppState = RoutingRootState & AbfahrtenRootState;

export type StateThunkAction<R, State> = ThunkAction<R, State, undefined, any>;

export type AbfahrtenThunkResult<R = any> = StateThunkAction<R, AbfahrtenState>;
export type RoutingThunkResult<R = any> = StateThunkAction<R, RoutingState>;

export type AppStore = Store<AppState, any>;
