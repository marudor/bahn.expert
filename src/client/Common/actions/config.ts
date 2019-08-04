import { CommonThunkResult } from 'AppState';
import { createAction } from 'deox';
import { setCookieOptions } from 'client/util';
import { ThemeType } from 'client/Themes/type';
import Cookies from 'universal-cookie';

const Actions = {
  setTheme: createAction('SET_THEME', resolve => (p: ThemeType) => resolve(p)),
  setCookies: createAction('SET_COOKIES', resolve => (c: Cookies) =>
    resolve(c)
  ),
  setBaseUrl: createAction('SET_BASE_URL', resolve => (c: string) =>
    resolve(c)
  ),
};

export default Actions;

// eslint-disable-next-line no-nested-ternary
const defaultTheme = global.SERVER
  ? ThemeType.light
  : window.matchMedia('(prefers-color-scheme: dark)').matches
  ? ThemeType.dark
  : ThemeType.light;

export const setCookies = (cookies: Cookies): CommonThunkResult => dispatch => {
  const theme =
    (ThemeType[cookies.get('theme')] as undefined | ThemeType) || defaultTheme;

  if (!global.SERVER) {
    cookies.set('theme', theme, setCookieOptions);
  }

  dispatch(Actions.setTheme(theme));
  dispatch(Actions.setCookies(cookies));
};
export const setTheme = (theme: ThemeType): CommonThunkResult => (
  dispatch,
  getState
) => {
  const cookies = getState().config.cookies;

  dispatch(Actions.setTheme(theme));

  cookies.set('theme', theme, setCookieOptions);
};
