/* eslint-disable no-process-env */
import Cookies from 'universal-cookie';
import StorageInterface from 'shared/hooks/useStorage/StorageInterface';

const setCookieOptions = {
  expires: new Date('2037-12-12'),
  httpOnly: false,
  path: '/',
  secure: process.env.NODE_ENV !== 'test',
  sameSite: 'strict' as 'strict',
};

export default class Storage extends Cookies implements StorageInterface {
  set(name: string, value: any) {
    return super.set(name, value, setCookieOptions);
  }
}
