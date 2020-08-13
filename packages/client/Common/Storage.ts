/* eslint-disable no-process-env */
import { WebConfigMap } from 'client/useStorage';
import Cookies, { CookieSetOptions } from 'universal-cookie';

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
    // @ts-expect-error
    if (raw === 'false') return false;
    // @ts-expect-error
    if (raw === 'true') return true;
    return raw;
  }
  set<K extends keyof WebConfigMap>(name: K, value: WebConfigMap[K]) {
    return super.set(name, value, setCookieOptions);
  }
}

export class ClientStorage extends ServerStorage {
  get<K extends keyof WebConfigMap>(name: K): WebConfigMap[K] | undefined {
    const cookieGet = super.get(name);
    if (cookieGet != null) return cookieGet;
    const storageGet = localStorage.getItem(name);
    if (storageGet) {
      try {
        const value = JSON.parse(storageGet);
        super.set(name, value);
      } catch {
        // ignored, fallback failed
      }
    }
    return undefined;
  }
  set<K extends keyof WebConfigMap>(name: K, value: WebConfigMap[K]) {
    super.set(name, value);
    localStorage.setItem(name, JSON.stringify(value));
  }
  remove(name: string) {
    super.remove(name);
    localStorage.removeItem(name);
  }
}
