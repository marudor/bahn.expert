/* eslint-disable no-process-env */
import Cookies from 'universal-cookie';
import type { CookieSetOptions } from 'universal-cookie';
import type { WebConfigMap } from 'client/useStorage';

const setCookieOptions: CookieSetOptions = {
  maxAge: 100000000,
  httpOnly: false,
  path: '/',
  sameSite: 'strict',
};

export interface StorageInterface {
  get<K extends keyof WebConfigMap>(name: K): WebConfigMap[K] | undefined;
  get<T>(name: string): T | undefined;
  set<K extends keyof WebConfigMap>(name: K, value: WebConfigMap[K]): void;
  set<T>(name: string, value: T): void;
  remove<K extends keyof WebConfigMap>(name: K): void;
}

export class ServerStorage extends Cookies implements StorageInterface {
  get<K extends keyof WebConfigMap>(name: K): WebConfigMap[K] | undefined {
    const raw = super.get(name);
    // @ts-expect-error works
    if (raw === 'false') return false;
    // @ts-expect-error works
    if (raw === 'true') return true;
    return raw;
  }
  set<K extends keyof WebConfigMap>(name: K, value: WebConfigMap[K]): void {
    return super.set(name, value, setCookieOptions);
  }
}

export class ClientStorage extends ServerStorage {
  get<K extends keyof WebConfigMap>(name: K): WebConfigMap[K] | undefined {
    const cookieGet = super.get(name);
    if (cookieGet != null) return cookieGet;
    return undefined;
  }
}
