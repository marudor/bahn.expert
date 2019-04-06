// @flow
import type { AbfahrtenRootState } from 'Abfahrten/reducer';
import type { Dispatch as ReduxDispatch, Store } from 'redux';
import type { RoutingRootState } from 'Routing/reducer';

export type RoutingState = RoutingRootState;
export type AbfahrtenState = AbfahrtenRootState;
export type AppState = {|
  ...AbfahrtenRootState,
  ...RoutingRootState,
|};
export type Action = any;
export type Dispatch = ReduxDispatch<Action>;
export type AppStore = Store<AppState, Action>;

export type InnerThunkAction<-State> = (dispatch: Dispatch, () => State) => Promise<any>;
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

// eslint-disable-next-line no-unused-vars
type _ActionType<R, Fn: (...rest: R) => InnerThunkAction<any>> = (...rest: R) => Promise<any>;
export type ActionType<Fn> = _ActionType<*, Fn>;
