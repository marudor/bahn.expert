import { createApp } from 'server/app';

export function createTestServer() {
  const app = createApp();
  const server = app.listen();

  afterAll(() => {
    server.close();
  });

  return server;
}
