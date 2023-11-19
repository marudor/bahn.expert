/* eslint-disable unicorn/prefer-module */
/* eslint-disable no-underscore-dangle */
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import Axios from 'axios';
import fs from 'node:fs';
import Nock from 'nock';
import path from 'node:path';
// eslint-disable-next-line no-restricted-imports
import routes from '@/server/API';

if (fs.existsSync(path.resolve(__dirname, 'setup.js'))) {
  throw new Error('Run `pnpm build:clean`. State dirty');
  // eslint-disable-next-line no-unreachable, unicorn/no-process-exit
  process.exit(1);
}

const isoDateRegex =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}\.\d*)(?:Z|([+-])([\d:|]*))?$/;

globalThis.parseJson = (json: string) => {
  try {
    return JSON.parse(json, (_key, value) => {
      if (typeof value === 'string' && isoDateRegex.test(value)) {
        return new Date(value);
      }
      return value;
    });
  } catch {
    return json;
    // Ignoring
  }
};

Axios.defaults.baseURL = 'http://localhost';

expect(new Date().getTimezoneOffset()).toBe(0);

afterEach(() => {
  cleanup();
});

// @ts-expect-error just mocked
window.matchMedia = () => ({
  matches: false,
});

beforeAll(() => {
  Nock.disableNetConnect();
  Nock.emitter.on('no match', (req) => {
    throw new Error(`No nock mock for ${req.method} ${req.path}`);
  });

  globalThis.nock = Nock('http://localhost');
  globalThis.nock.intercept = ((oldFn) => {
    // eslint-disable-next-line func-names
    return function (this: any, ...args: any) {
      if (typeof args[0] === 'string') {
        args[0] = args[0].replaceAll(' ', '%20');
      }

      return oldFn.apply(this, args);
    };
  })(globalThis.nock.intercept);
});

const routeRegexp = /\/v(\d+|experimental)\//;
afterEach(() => {
  const allRoutes = routes.stack.filter((s) =>
    routeRegexp.exec(s.path as string),
  );
  // @ts-expect-error this exsits
  for (const i of globalThis.nock.interceptors) {
    if (!allRoutes.some((r) => r.match(i.path))) {
      throw new Error(`${i.path} does not match available routes`);
    }
  }
});

afterAll(() => {
  Nock.restore();
  // @ts-expect-error mocked
  globalThis.nock = undefined;
});
