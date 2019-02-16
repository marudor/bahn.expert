// @flow
import '@babel/polyfill';
import 'server/localStorageShim';
import Nock from 'nock';

global.PROD = true;

beforeAll(() => {
  Nock.disableNetConnect();
  Nock.enableNetConnect(/127\.0\.0\.1/);
});
