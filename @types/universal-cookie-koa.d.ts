import Cookies from 'universal-cookie';

declare module 'koa' {
  interface Request {
    universalCookies: Cookies;
  }
}
