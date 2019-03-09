// @flow
import type { State as AbfahrtenState } from 'client/reducer/abfahrten';
import type { State as AuslastungState } from 'client/reducer/auslastung';
import type { State as ConfigState } from 'client/reducer/config';
import type { State as FavState } from 'client/reducer/fav';
import type { Dispatch as ReduxDispatch, Store } from 'redux';
import type { State as ReihungState } from 'client/reducer/reihung';

export type AppState = {|
  +abfahrten: AbfahrtenState,
  +auslastung: AuslastungState,
  +config: ConfigState,
  +fav: FavState,
  +reihung: ReihungState,
|};
export type Action = any;
export type Dispatch = ReduxDispatch<Action>;
export type AppStore = Store<AppState, Action>;

export type InnerThunkAction = (dispatch: Dispatch, () => AppState) => Promise<any>;
export type ThunkAction<A1 = *, A2 = *, A3 = *, A4 = *, A5 = *, A6 = *, A7 = *, A8 = *, A9 = *> = (
  A1,
  A2,
  A3,
  A4,
  A5,
  A6,
  A7,
  A8,
  A9
) => InnerThunkAction;

// eslint-disable-next-line no-unused-vars
type _ActionType<R, Fn: (...rest: R) => InnerThunkAction> = (...rest: R) => Promise<any>;
export type ActionType<Fn> = _ActionType<*, Fn>;
