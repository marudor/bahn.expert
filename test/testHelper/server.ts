import { createApp } from 'server/app';

export async function createTestServer() {
  const app = await createApp();
  const server = app.listen();

  afterAll(() => {
    server.close();
  });

  return server;
}
