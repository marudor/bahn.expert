/* eslint-disable no-process-env */
import Cookies, { CookieSetOptions } from 'universal-cookie';
import type StorageInterface from 'shared/hooks/useStorage/StorageInterface';

const setCookieOptions: CookieSetOptions = {
  maxAge: 100000000,
  httpOnly: false,
  path: '/',
  sameSite: 'strict',
  secure: global.TEST ? undefined : true,
};

export default class Storage extends Cookies implements StorageInterface {
  set(name: string, value: any) {
    return super.set(name, value, setCookieOptions);
  }
}
