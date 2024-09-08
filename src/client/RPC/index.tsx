import { parse, stringify } from '@/devalue';
import type { AppRouter } from '@/server/rpc';
import { NoSsr } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
	type TRPCLink,
	createTRPCClient,
	httpLink,
	unstable_httpBatchStreamLink,
} from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';

export const trpc = createTRPCReact<AppRouter>();

const link = !globalThis.Cypress ? unstable_httpBatchStreamLink : httpLink;

const links = [
	link({
		url: '/rpc',
		transformer: {
			deserialize: parse,
			serialize: stringify,
		},
	}),
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
