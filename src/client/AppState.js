// @flow
import type { AbfahrtenRootState } from 'Abfahrten/reducer';
import type { CommonRootState } from 'Common/reducer';
import type { RoutingRootState } from 'Routing/reducer';
import type { Store } from 'redux';

export type RoutingState = RoutingRootState;
export type AbfahrtenState = AbfahrtenRootState;
export type CommonState = CommonRootState;
export type AppState = $ReadOnly<{|
  ...AbfahrtenRootState,
  ...RoutingRootState,
  ...CommonRootState,
|}>;

export type AppStore = Store<AppState, DispatchAction>;

export type InnerThunkAction<-State, Action = *> = (dispatch: Dispatch<Action>, () => State) => Promise<any>;
export type AbfahrtenInnerThunkAction = InnerThunkAction<AbfahrtenState>;
export type RoutingInnerThunkAction = InnerThunkAction<RoutingState>;
export type ThunkAction<-State, A1 = *, A2 = *, A3 = *, A4 = *, A5 = *, A6 = *, A7 = *, A8 = *, A9 = *> = (
  A1,
  A2,
  A3,
  A4,
  A5,
  A6,
  A7,
  A8,
  A9
) => InnerThunkAction<State>;
export type RoutingThunkAction<A1 = *, A2 = *, A3 = *, A4 = *, A5 = *, A6 = *, A7 = *, A8 = *, A9 = *> = ThunkAction<
  RoutingState,
  A1,
  A2,
  A3,
  A4,
  A5,
  A6,
  A7,
  A8,
  A9
>;
export type AbfahrtenThunkAction<A1 = *, A2 = *, A3 = *, A4 = *, A5 = *, A6 = *, A7 = *, A8 = *, A9 = *> = ThunkAction<
  AbfahrtenState,
  A1,
  A2,
  A3,
  A4,
  A5,
  A6,
  A7,
  A8,
  A9
>;

// type _ActionType<R, Fn: (...rest: R) => InnerThunkAction<any>> = (...rest: R) => Promise<any>;
// export type ActionType<Fn> = _ActionType<*, Fn>;
