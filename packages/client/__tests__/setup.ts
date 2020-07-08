/* eslint-disable no-underscore-dangle */
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import fs from 'fs';
import Nock from 'nock';
import path from 'path';
import request from 'umi-request';

if (fs.existsSync(path.resolve(__dirname, 'setup.js'))) {
  throw new Error('Run `yarn all:clean`. State dirty');
  // eslint-disable-next-line no-unreachable
  process.exit(1);
}

// Custom React setup
global.M = require('react').createElement;
global.MF = require('react').Fragment;

request.extendOptions({
  prefix: 'http://localhost',
});

// eslint-disable-next-line jest/no-standalone-expect
expect(new Date().getTimezoneOffset()).toBe(0);

afterEach(() => {
  cleanup();
});

// @ts-ignore just mocked
window.matchMedia = () => ({
  matches: false,
});

beforeAll(() => {
  Nock.disableNetConnect();

  global.nock = Nock('http://localhost');
  global.nock.intercept = ((oldFn) => {
    // eslint-disable-next-line func-names
    return function (this: any, ...args: any) {
      args[0] = args[0].replace(/ /g, '%20');

      return oldFn.apply(this, args);
    };
  })(global.nock.intercept);
});

afterAll(() => {
  Nock.restore();
  // @ts-ignore
  global.nock = undefined;
});
