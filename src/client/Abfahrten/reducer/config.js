// @flow
import { type ActionType, handleActions } from 'redux-actions';
import { defaultConfig, setCookieOptions } from 'client/util';
import Actions from 'Abfahrten/actions/config';
import Cookies from 'universal-cookie';

export type State = {|
  cookies: Cookies,
  open: boolean,
  config: marudorConfig,
  baseUrl: string,
|};

const defaultState: State = {
  cookies: new Cookies(),
  open: false,
  config: defaultConfig,
  baseUrl: '',
};

export default handleActions<State, *>(
  {
    [String(Actions.setBaseUrl)]: (state: State, { payload }: ActionType<typeof Actions.setBaseUrl>) => ({
      ...state,
      baseUrl: payload,
    }),
    [String(Actions.setCookies)]: (state: State, { payload }: ActionType<typeof Actions.setCookies>) => {
      const config = {
        ...defaultConfig,
        ...payload.get('config'),
      };

      if (!config.checkIn && config.traewelling) {
        config.checkIn = 'traewelling';
      }

      return {
        ...state,
        open: false,
        config,
        cookies: payload,
      };
    },
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
