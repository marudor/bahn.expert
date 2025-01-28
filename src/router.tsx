import { createRouter as createReactRouter } from '@tanstack/react-router';

import { ClientStorage, ServerStorage } from '@/client/Common/Storage';
import { DefaultCatchBoundary } from '@/client/DefaultCatchBoundary';
import { theme } from '@/client/Themes';
import { parse, stringify } from '@/devalue';
import type { AppRouter } from '@/server/rpc';
import { ThemeProvider } from '@mui/material';
import {
	QueryClient,
	type QueryClientConfig,
	QueryClientProvider,
	dehydrate,
	hydrate,
} from '@tanstack/react-query';
import {
	type TRPCLink,
	httpBatchLink,
	httpLink,
	splitLink,
} from '@trpc/client';
import { createTRPCQueryUtils, createTRPCReact } from '@trpc/react-query';
import { CookiesProvider } from 'react-cookie';
import { routeTree } from './routeTree.gen';

export const trpc = createTRPCReact<AppRouter>();

const httpLinkOptions = {
	url: import.meta.env.SSR ? 'http://localhost:9042/rpc' : '/rpc',
	transformer: {
		deserialize: parse,
		serialize: stringify,
	},
};

const links = [
	!globalThis.Cypress && process.env.NODE_ENV === 'production'
		? splitLink({
				condition: (op) => op.context.skipBatch === true,
				true: httpLink(httpLinkOptions),
				false: httpBatchLink(httpLinkOptions),
			})
		: httpLink(httpLinkOptions),
] satisfies TRPCLink<AppRouter>[];

export const trpcClient = trpc.createClient({
	links,
});

const queryClientOptions: QueryClientConfig = {
	defaultOptions: {
		queries: {
			staleTime(query) {
				// @ts-expect-error ugly but wqorks
				switch (query.queryKey?.[0]?.[0]) {
					case 'stopPlace':
						return Number.POSITIVE_INFINITY;
				}
				return 3000;
			},
			retry: 0,
			refetchOnWindowFocus: false,
		},
	},
};

const queryClient = new QueryClient(queryClientOptions);

export const hydrateRouter = () => {
	if (!import.meta.env.SSR) {
		try {
			if (window.__TSR_SSR__) {
				const queryClientData = parse(window.__TSR_SSR__.dehydrated).payload
					.queryClientState;
				hydrate(queryClient, queryClientData);
			}
		} catch {}
	}
};

const trpcUtils = createTRPCQueryUtils({
	client: trpcClient,
	queryClient,
});
export type TRPCQueryUtilsType = typeof trpcUtils;

export const RPCProvider: FCC = ({ children }) => (
	<trpc.Provider queryClient={queryClient} client={trpcClient}>
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	</trpc.Provider>
);

export function createRouter(request?: Request) {
	const storage = request
		? new ServerStorage(request.headers.get('cookies'))
		: new ClientStorage();

	const Wrap: FCC = ({ children }) => (
		<RPCProvider>
			<CookiesProvider cookies={storage}>{children}</CookiesProvider>
		</RPCProvider>
	);

	return createReactRouter({
		context: {
			baseUrl: request?.url ? new URL(request.url).host : window.location.host,
			trpcUtils,
		},
		routeTree,
		// @ts-expect-error
		Wrap,
		InnerWrap: ({ children }) => (
			<ThemeProvider theme={theme}>{children}</ThemeProvider>
		),
		transformer: {
			parse,
			stringify,
		},
		defaultPendingMinMs: 300,
		defaultErrorComponent: DefaultCatchBoundary,
		dehydrate: () => ({
			queryClientState: dehydrate(queryClient),
		}),
		defaultPreload: 'intent',
	});
}

declare module '@tanstack/react-router' {
	interface Register {
		router: ReturnType<typeof createRouter>;
	}
}
