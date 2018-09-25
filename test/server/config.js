// @flow
import '@babel/polyfill';
import Nock from 'nock';

Nock.disableNetConnect();
Nock.enableNetConnect(/(127\.0\.0\.1)/);

beforeEach(() => {});

afterEach(() => {});
