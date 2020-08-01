/* eslint-disable no-process-env */
import { WebConfigMap } from 'client/useWebStorage';
import Cookies, { CookieSetOptions } from 'universal-cookie';
import type { StorageInterface } from 'shared/hooks/useStorage/StorageInterface';

const setCookieOptions: CookieSetOptions = {
  maxAge: 100000000,
  httpOnly: false,
  path: '/',
  sameSite: 'strict',
};

export class ServerStorage extends Cookies
  implements StorageInterface<WebConfigMap> {
  get(name: string) {
    const raw = super.get(name);
    if (raw === 'false') return false;
    if (raw === 'true') return true;
    return raw;
  }
  set<T>(name: string, value: T) {
    return super.set(name, value, setCookieOptions);
  }
}

export class ClientStorage extends ServerStorage {
  get<T>(name: string): T | undefined {
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
  set<T>(name: string, value: T) {
    super.set(name, value);
    localStorage.setItem(name, JSON.stringify(value));
  }
  remove(name: string) {
    super.remove(name);
    localStorage.removeItem(name);
  }
}
