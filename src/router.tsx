import { createRouter as createReactRouter } from '@tanstack/react-router';

import { ClientStorage, ServerStorage } from '@/client/Common/Storage';
import { DefaultCatchBoundary } from '@/client/DefaultCatchBoundary';
import { parse, stringify } from 'devalue';
import { CookiesProvider } from 'react-cookie';
import { routeTree } from './routeTree.gen';

export function createRouter(request?: Request) {
	const storage = request
		? new ServerStorage(request.headers.get('cookies'))
		: new ClientStorage();

	const Wrap: FCC = ({ children }) => (
		<CookiesProvider cookies={storage}>{children}</CookiesProvider>
	);

	return createReactRouter({
		defaultPreload: 'render',
		routeTree,
		// @ts-expect-error
		Wrap,
		// @ts-expect-error ??? wrong typing?
		transformer: {
			parse,
			stringify: stringify,
		},
		defaultErrorComponent: DefaultCatchBoundary,
	});
}

declare module '@tanstack/react-router' {
	interface Register {
		router: ReturnType<typeof createRouter>;
	}
}
