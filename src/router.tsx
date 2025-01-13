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
	createTRPCQueryUtils,
	createTRPCReact,
	httpBatchLink,
	httpLink,
	splitLink,
} from '@trpc/react-query';
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
			staleTime: 3000,
			retry: 0,
			refetchOnWindowFocus: false,
		},
	},
};

const queryClient = new QueryClient(queryClientOptions);

if (!import.meta.env.SSR && window.__TSR__) {
	const queryClientData = parse(window.__TSR__.dehydrated).payload
		.queryClientState;
	hydrate(queryClient, queryClientData);
}

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
			fullUrl: request?.url || window.location.href,
			baseUrl: request?.url ? new URL(request.url).host : window.location.host,
			trpcUtils,
		},
		routeTree,
		// @ts-expect-error
		Wrap,
		InnerWrap: ({ children }) => (
			<ThemeProvider theme={theme}>{children}</ThemeProvider>
		),
		// @ts-expect-error ??? wrong typing?
		transformer: {
			parse,
			stringify: stringify,
		},
		defaultErrorComponent: DefaultCatchBoundary,
		dehydrate: () => ({
			queryClientState: dehydrate(queryClient),
		}),
	});
}

declare module '@tanstack/react-router' {
	interface Register {
		router: ReturnType<typeof createRouter>;
	}
}
