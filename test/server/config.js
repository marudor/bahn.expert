// @flow
import '@babel/polyfill';
import Nock from 'nock';

beforeAll(() => {
  Nock.disableNetConnect();
});
