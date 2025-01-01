import type { Server } from 'node:http';
import { createApp } from '@/server/app';
import { afterAll } from 'vitest';

export async function createTestServer(): Promise<Server> {
	const app = await createApp();
	const server = app.listen();

	afterAll(() => {
		server.close();
	});

	return server;
}
