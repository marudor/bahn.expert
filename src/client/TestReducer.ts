// @flow
// import Cookies from 'universal-cookie';
import { AppState } from 'AppState';
import { set } from 'lodash';
import deepMerge from 'deepmerge';

let initialState: AppState;

export default function handleTestActions(state: AppState, action: any) {
  // eslint-disable-next-line
  switch (action.type) {
    case '@@TEST/MODIFY':
      return deepMerge(state, action.payload, { clone: false });
    case '@@TEST/SETAT':
      return set(
        deepMerge(state, {}, { clone: false }),
        action.payload.path,
        action.payload.value
      );
    case '@@TEST/RESTORE': {
      const s = deepMerge({}, initialState, { clone: false });

      const cookies = s.config.cookies;

      Object.keys(cookies.getAll()).forEach(cookieKey => {
        cookies.remove(cookieKey);
      });

      return s;
    }
    case '@@redux/INIT':
      if (!initialState && state) {
        initialState = deepMerge({}, state, { clone: false });
      }
      break;
  }

  return { ...state };
}
