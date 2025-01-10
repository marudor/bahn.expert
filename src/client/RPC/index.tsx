import type { AppRouter } from '@/server/rpc';
import { NoSsr } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
	type TRPCLink,
	createTRPCClient,
	httpBatchLink,
	httpLink,
	splitLink,
} from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import { parse, stringify } from 'devalue';

export const trpc = createTRPCReact<AppRouter>();

const httpLinkOptions = {
	url: '/rpc',
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

export const trpcClient = createTRPCClient<AppRouter>({
	links,
});

// TODO: SSR with data would need some optimization here
const clientTrpcClient = trpc.createClient({
	links,
});

const clientQueryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 0,
			refetchOnWindowFocus: false,
		},
	},
});

export const RPCProvider: FCC = ({ children }) => {
	return (
		<trpc.Provider queryClient={clientQueryClient} client={clientTrpcClient}>
			<QueryClientProvider client={clientQueryClient}>
				{!globalThis.Cypress && (
					<NoSsr>
						<ReactQueryDevtools />
					</NoSsr>
				)}
				{children}
			</QueryClientProvider>
		</trpc.Provider>
	);
};
