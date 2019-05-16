/* eslint-disable no-underscore-dangle */
import { AppState } from 'AppState';
import { set } from 'lodash';
import { Store } from 'redux';
import createRealStore from 'client/createStore';

export const defaultState = {};

// export type MockStore = Store<AppState, *, *> & {
//     activateLegacyFeature: (feature: $Keys<Features>, options?: Object) => void,
//     disableLegacyFeature: (feature: $Keys<Features>) => void,
//     activateFeature: <F: $Keys<FeatureConfig$NestedFeatures>>(
//         feature: F,
//         options?: $Exact<
//             $Rest<
//                 $NonMaybeType<$ElementType<FeatureConfig$NestedFeatures, F>>,
//                 {
//                     +type: $ElementType<$NonMaybeType<$ElementType<FeatureConfig$NestedFeatures, F>>, 'type'>,
//                 }
//             >
//         >
//     ) => void,
//     disableFeature: (
//         feature: $Keys<FeatureConfig$NestedFeatures>,
//         trafficType?: $Keys<FeatureConfig$ByTrafficType>,
//         deviceType?: $Keys<FeatureConfig$ByDeviceType>
//     ) => void,
//     modify: (modification?: $Shape<AppState>) => void,
//     restore: () => void,
//     expect: (fn: (AppState) => any) => JestExpectType & JestPromiseType & EnzymeMatchersType,
//     setCookie: typeof Cookies.prototype.set,
//     setAccessUser: (options?: {
//         displayName?: string,
//         isAnonymous?: boolean,
//         secret?: string,
//     }) => void,
//     setLoggedIn: () => void,
//     setLoggedInAnonymous: () => void,
//     setAt: (path: string | string[], v: mixed) => void,
//     mergeAt: (path: string | string[], v: mixed) => void,
// };

interface MockStore extends Store {
  modify(partialState: Partial<AppState>): void;
  restore(): void;
  setAt(path: string | string[], value: any): void;
  mergeAt(path: string | string[], value: any): void;
}

let store: MockStore;

export function createStore(partialState = {}) {
  if (store) {
    store.modify(partialState);

    return store;
  }
  // @ts-ignore
  store = createRealStore(partialState);

  // store.setCookie = (...args) => {
  //     store.getState().Config.cookies.set(...args);
  // };

  store.restore = () => {
    store.dispatch({
      type: '@@TEST/RESTORE',
    });
  };
  store.modify = (partialState: Partial<AppState> = {}) => {
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

  // @ts-ignore
  global.__getTestStore__ = () => store;

  return store;
}
