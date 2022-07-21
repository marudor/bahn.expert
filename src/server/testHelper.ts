import { createApp } from 'server/app';
import type { Server } from 'http';

export function createTestServer(): Server {
  const app = createApp();
  const server = app.listen();

  afterAll(() => {
    server.close();
  });

  return server;
}
