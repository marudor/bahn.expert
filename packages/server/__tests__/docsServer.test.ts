/* eslint-disable jest/expect-expect */
import createDocsServer from 'server/docsServer';
import request from 'supertest';

describe('docsServer', () => {
  const server = createDocsServer();

  afterAll(() => {
    server.close();
  });

  it('should deliver docs', () =>
    request(server)
      .get('/')
      .expect(/Download OpenAPI specification/)
      .expect(200));
});
