import { AbfahrtenRootState } from 'Abfahrten/reducer';
import { CommonRootState } from 'Common/reducer';
import { RoutingRootState } from 'Routing/reducer';
import { Store } from 'redux';
import { ThunkAction } from 'redux-thunk';

export type RoutingState = CommonRootState & RoutingRootState;
export type AbfahrtenState = CommonRootState & AbfahrtenRootState;
export type CommonState = CommonRootState;
export type AppState = RoutingRootState & AbfahrtenRootState & CommonRootState;

export type StateThunkAction<R, State> = ThunkAction<R, State, undefined, any>;

export type AbfahrtenThunkResult<R = any> = StateThunkAction<R, AbfahrtenState>;
export type CommonThunkResult<R = any> = StateThunkAction<R, CommonState>;
export type RoutingThunkResult<R = any> = StateThunkAction<R, RoutingState>;

export type AppStore = Store<AppState, any>;
