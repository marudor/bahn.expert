/* eslint-disable no-underscore-dangle */
import { AppState } from 'AppState';
import { DeepPartial } from 'utility-types';
import { set } from 'lodash';
import { Store } from 'redux';
import createRealStore from 'client/createStore';

export const defaultState = {};

export interface MockStore extends Store<AppState> {
  modify(partialState: DeepPartial<AppState>): void;
  restore(): void;
  setAt(path: string | string[], value: any): void;
  mergeAt(path: string | string[], value: any): void;
}

let store: MockStore;

store = createStore();

export const getStore = () => store;
export function createStore(partialState = {}) {
  if (store) {
    store.modify(partialState);

    return store;
  }
  // @ts-ignore
  store = createRealStore(partialState);

  store.restore = () => {
    store.dispatch({
      type: '@@TEST/RESTORE',
    });
  };
  store.modify = (partialState: DeepPartial<AppState> = {}) => {
    store.dispatch({
      type: '@@TEST/MODIFY',
      payload: partialState,
    });
  };
  store.setAt = (path: string | string[], value: any) => {
    store.dispatch({
      type: '@@TEST/SETAT',
      payload: {
        path,
        value,
      },
    });
  };
  store.mergeAt = (path: string | string[], value: any) => {
    store.dispatch({
      type: '@@TEST/MODIFY',
      payload: set({}, path, value),
    });
  };
  // store.expect = <S>(fn: AppState => S) => expect(fn(store.getState()));

  store.dispatch({
    type: '@@TEST/INIT',
  });

  return store;
}
