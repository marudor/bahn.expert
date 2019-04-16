import 'core-js/stable';
import 'regenerator-runtime/runtime';
import Nock from 'nock';

global.PROD = true;

beforeAll(() => {
  Nock.disableNetConnect();
  Nock.enableNetConnect(/127\.0\.0\.1/);
});

afterAll(() => {
  Nock.restore();
});
