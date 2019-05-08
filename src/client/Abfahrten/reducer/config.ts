import { createReducer } from 'deox';
import { defaultConfig, setCookieOptions } from 'client/util';
import { MarudorConfig } from 'Common/config';
import Actions from 'Abfahrten/actions/config';
import Cookies from 'universal-cookie';

export type State = {
  cookies: Cookies;
  open: boolean;
  config: MarudorConfig;
  baseUrl: string;
};

const defaultState: State = {
  cookies: new Cookies(),
  open: false,
  config: defaultConfig,
  baseUrl: '',
};

export default createReducer(defaultState, handle => [
  handle(Actions.setBaseUrl, (state, { payload }) => ({
    ...state,
    baseUrl: payload,
  })),
  handle(Actions.setCookies, (state, { payload }) => {
    const config: MarudorConfig = {
      ...defaultConfig,
      ...payload.get('config'),
      // eslint-disable-next-line no-underscore-dangle
      ...(global.__ConfigOverride__ ? global.__ConfigOverride__ : {}),
    };

    return {
      ...state,
      open: false,
      config,
      cookies: payload,
    };
  }),
  handle(Actions.setMenu, (state, { payload }) => ({
    ...state,
    open: payload,
  })),
  handle(Actions.setConfig, (state, { payload: { key, value, temp } }) => {
    const newState = {
      ...state,
      config: {
        ...state.config,
        [key]: value,
      },
    };

    if (!temp) {
      state.cookies.set('config', newState.config, setCookieOptions);
    }

    return newState;
  }),
]);
