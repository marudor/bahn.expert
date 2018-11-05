// @flow
import '@babel/polyfill';
import Nock from 'nock';

beforeAll(() => {
  Nock.disableNetConnect();
  Nock.enableNetConnect(/127\.0\.0\.1/);
});
