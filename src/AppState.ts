import { AbfahrtenRootState } from 'Abfahrten/reducer';
import { CommonRootState } from 'Common/reducer';
import { RoutingRootState } from 'Routing/reducer';
import { Store } from 'redux';
import { ThunkAction } from 'redux-thunk';

export type RoutingState = CommonRootState & RoutingRootState;
export type AbfahrtenState = CommonRootState & AbfahrtenRootState;
export type CommonState = CommonRootState;
export type AppState = RoutingRootState & AbfahrtenRootState & CommonRootState;

type StateThunkAction<R, State> = ThunkAction<R, State, undefined, any>;

export type AbfahrtenThunkResult<R = any> = StateThunkAction<R, AbfahrtenState>;
export type CommonThunkResult<R = any> = StateThunkAction<R, CommonState>;
export type RoutingThunkResult<R = any> = StateThunkAction<R, RoutingState>;

export type AppStore = Store<AppState, any>;

// export type InnerThunkAction<-State, Action = *> = (
//   dispatch: Dispatch<Action>,
//   () => State
// ) => Promise<any>;
// export type AbfahrtenInnerThunkAction = InnerThunkAction<AbfahrtenState>;
// export type RoutingInnerThunkAction = InnerThunkAction<RoutingState>;
// export type CommonInnerThunkAction = InnerThunkAction<CommonState>;
// export type ThunkAction<
//   -State,
//   A1 = *,
//   A2 = *,
//   A3 = *,
//   A4 = *,
//   A5 = *,
//   A6 = *,
//   A7 = *,
//   A8 = *,
//   A9 = *
// > = (A1, A2, A3, A4, A5, A6, A7, A8, A9) => InnerThunkAction<State>;
// export type RoutingThunkAction<
//   A1 = *,
//   A2 = *,
//   A3 = *,
//   A4 = *,
//   A5 = *,
//   A6 = *,
//   A7 = *,
//   A8 = *,
//   A9 = *
// > = ThunkAction<RoutingState, A1, A2, A3, A4, A5, A6, A7, A8, A9>;
// export type AbfahrtenThunkAction<
//   A1 = *,
//   A2 = *,
//   A3 = *,
//   A4 = *,
//   A5 = *,
//   A6 = *,
//   A7 = *,
//   A8 = *,
//   A9 = *
// > = ThunkAction<AbfahrtenState, A1, A2, A3, A4, A5, A6, A7, A8, A9>;

// export type CommonThunkAction<
//   A1 = *,
//   A2 = *,
//   A3 = *,
//   A4 = *,
//   A5 = *,
//   A6 = *,
//   A7 = *,
//   A8 = *,
//   A9 = *
// > = ThunkAction<CommonState, A1, A2, A3, A4, A5, A6, A7, A8, A9>;

// // type _ActionType<R, Fn: (...rest: R) => InnerThunkAction<any>> = (...rest: R) => Promise<any>;
// // export type ActionType<Fn> = _ActionType<*, Fn>;
