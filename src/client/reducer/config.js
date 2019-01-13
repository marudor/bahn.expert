// @flow
import { Actions } from 'client/actions/config';
import { type ActionType, handleActions } from 'redux-actions';
import { defaultConfig, setCookieOptions } from 'client/util';
import Cookies from 'universal-cookie';

export type State = {|
  cookies: Cookies,
  open: boolean,
  config: marudorConfig,
|};

const defaultState: State = {
  cookies: new Cookies(),
  open: false,
  config: defaultConfig,
};

export default handleActions<State, *>(
  {
    [String(Actions.setCookies)]: (state: State, { payload }: ActionType<typeof Actions.setCookies>) => ({
      open: false,
      config: {
        ...defaultConfig,
        ...payload.get('config'),
      },
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
