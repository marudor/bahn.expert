import { parse, stringify } from '@/devalue';
import type { AppRouter } from '@/server/rpc';
import { createTRPCClient, httpLink } from '@trpc/client';

export const scriptsTrpc = createTRPCClient<AppRouter>({
	links: [
		httpLink({
			url: 'https://bahn.expert/rpc',
			transformer: {
				deserialize: parse,
				serialize: stringify,
			},
		}),
	],
});
