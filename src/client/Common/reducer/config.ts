import { createReducer } from 'deox';
import { ThemeType } from 'client/Themes';
import Actions from 'Common/actions/config';
import Cookies from 'universal-cookie';

export type State = {
  theme: ThemeType;
  cookies: Cookies;
  baseUrl: string;
};

const defaultState: State = {
  cookies: new Cookies(),
  theme: ThemeType.light,
  baseUrl: '',
};

export default createReducer(defaultState, handle => [
  handle(Actions.setBaseUrl, (state, { payload }) => ({
    ...state,
    baseUrl: payload,
  })),
  handle(Actions.setTheme, (state, { payload }) => ({
    ...state,
    theme: payload,
  })),
  handle(Actions.setCookies, (state, { payload }) => ({
    ...state,
    cookies: payload,
  })),
]);
