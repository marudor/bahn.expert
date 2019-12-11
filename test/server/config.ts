import 'core-js/stable';
import Nock from 'nock';
import path from 'path';

// eslint-disable-next-line jest/no-standalone-expect
expect(new Date().getTimezoneOffset()).toBe(0);

beforeAll(() => {
  Nock.disableNetConnect();
  Nock.enableNetConnect(/127\.0\.0\.1/);

  Nock('http://example.com')
    .get('/')
    .replyWithFile(
      200,
      path.resolve(__dirname, '__fixtures__/wifiTraindata.json')
    );
});

afterAll(() => {
  Nock.restore();
});
