// @flow
import { Actions } from 'client/actions/config';
import { type ActionType, handleActions } from 'redux-actions';
import { setCookieOptions } from 'client/util';
import Cookies from 'universal-cookie';

export type State = {|
  cookies: Cookies,
  open: boolean,
  config: {
    time: boolean,
    searchType: string,
    traewelling: boolean,
    zoomReihung: boolean,
    useDbf: boolean,
    showSupersededMessages: boolean,
  },
|};

const defaultState: State = {
  cookies: new Cookies(),
  open: false,
  config: {
    searchType: '',
    time: true,
    traewelling: false,
    zoomReihung: true,
    useDbf: false,
    showSupersededMessages: false,
  },
};

export default handleActions<State, *>(
  {
    [String(Actions.setCookies)]: (state: State, { payload }: ActionType<typeof Actions.setCookies>) => ({
      open: false,
      config: payload.get('config') || defaultState.config,
      cookies: payload,
    }),
    [String(Actions.setMenu)]: (state: State, { payload }: ActionType<typeof Actions.setMenu>) => ({
      ...state,
      open: payload,
    }),
    [String(Actions.setConfig)]: (state: State, { payload: { key, value } }: ActionType<typeof Actions.setConfig>) => {
      const newState = {
        ...state,
        config: {
          ...state.config,
          [key]: value,
        },
      };

      state.cookies.set('config', newState.config, setCookieOptions);

      return newState;
    },
  },
  defaultState
);
