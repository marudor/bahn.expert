import { RoutingRootState } from 'Routing/reducer';
import { Store } from 'redux';
import { ThunkAction } from 'redux-thunk';

export type RoutingState = RoutingRootState;
export type AppState = RoutingRootState;

export type StateThunkAction<R, State> = ThunkAction<R, State, undefined, any>;

export type RoutingThunkResult<R = any> = StateThunkAction<R, RoutingState>;

export type AppStore = Store<AppState, any>;
