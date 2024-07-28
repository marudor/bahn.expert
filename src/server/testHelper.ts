import type { Server } from 'node:http';
import { createApp } from '@/server/app';
import { afterAll } from 'vitest';

export function createTestServer(): Server {
	const app = createApp();
	const server = app.listen();

	afterAll(() => {
		server.close();
	});

	return server;
}
