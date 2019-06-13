import 'core-js/stable';
import Nock from 'nock';

if (process.env.TZ !== 'UTC') {
  throw new Error('Please start tests with TZ=UTC to ensure stable times');
}

global.PROD = true;

beforeAll(() => {
  Nock.disableNetConnect();
  Nock.enableNetConnect(/127\.0\.0\.1/);
});

afterAll(() => {
  Nock.restore();
});
