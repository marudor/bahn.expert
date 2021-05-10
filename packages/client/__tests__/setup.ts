/* eslint-disable no-underscore-dangle */
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import Axios from 'axios';
import fs from 'fs';
import Nock from 'nock';
import path from 'path';
// eslint-disable-next-line no-restricted-imports
import routes from 'server/API';

if (fs.existsSync(path.resolve(__dirname, 'setup.js'))) {
  throw new Error('Run `yarn all:clean`. State dirty');
  // eslint-disable-next-line no-unreachable
  process.exit(1);
}

const isoDateRegex =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;

globalThis.parseJson = (json: string) => {
  try {
    return JSON.parse(json, (_key, value) => {
      if (typeof value === 'string') {
        if (isoDateRegex.exec(value)) {
          return new Date(value);
        }
      }
      return value;
    });
  } catch {
    return json;
    // Ignoring
  }
};

Axios.defaults.baseURL = 'http://localhost';

// eslint-disable-next-line jest/no-standalone-expect
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

  globalThis.nock = Nock('http://localhost');
  globalThis.nock.intercept = ((oldFn) => {
    // eslint-disable-next-line func-names
    return function (this: any, ...args: any) {
      args[0] = args[0].replace(/ /g, '%20');

      return oldFn.apply(this, args);
    };
  })(globalThis.nock.intercept);
});

const routeRegexp = /\/v(\d+|experimental)\//;
afterEach(() => {
  const allRoutes = routes.stack.filter((s) => routeRegexp.exec(s.path));
  // @ts-expect-error this exsits
  globalThis.nock.interceptors.forEach((i) => {
    if (!allRoutes.some((r) => r.match(i.path))) {
      throw new Error(`${i.path} does not match available routes`);
    }
  });
});

afterAll(() => {
  Nock.restore();
  // @ts-expect-error mocked
  globalThis.nock = undefined;
});
